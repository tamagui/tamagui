#!/usr/bin/env bash
set -euo pipefail

#
# transcrypt - https://github.com/elasticdog/transcrypt
#
# A script to configure transparent encryption of sensitive files stored in
# a Git repository. It utilizes OpenSSL's symmetric cipher routines and follows
# the gitattributes(5) man page regarding the use of filters.
#
# Copyright (c) 2014-2019 Aaron Bull Schaefer <aaron@elasticdog.com>
# This source code is provided under the terms of the MIT License
# that can be be found in the LICENSE file.
#

##### OVERRIDES

# Disable any global grep options, to avoid problems like '--colors=always'
# shellcheck disable=SC2034
GREP_OPTIONS=""

##### CONSTANTS

# the release version of this script
readonly VERSION='2.3.1-pre'

# the default cipher to utilize
readonly DEFAULT_CIPHER='aes-256-cbc'

# context name must match this regexp to ensure it is safe for git config and attrs
readonly CONTEXT_REGEX='[a-z](-?[a-z0-9])*'

##### FUNCTIONS

# load encryption password
# by default is stored in git config, modify this function to move elsewhere
load_password() {
	local context_config_group=${1:-}
	local password
	password=$(git config --get --local "transcrypt${context_config_group}.password")
	echo "$password"
}

# save encryption password
# by default is stored in git config, modify this function to move elsewhere
save_password() {
	local password=$1
	local context_config_group=${2:-}
	git config "transcrypt${context_config_group}.password" "$password"
}

# print a canonicalized absolute pathname
realpath() {
	local path=$1

	# make path absolute
	local abspath=$path
	if [[ -n ${abspath##/*} ]]; then
		abspath=$(pwd -P)/$abspath
	fi

	# canonicalize path
	local dirname=
	if [[ -d $abspath ]]; then
		dirname=$(cd "$abspath" >/dev/null && pwd -P)
		abspath=$dirname
	elif [[ -e $abspath ]]; then
		dirname=$(cd "${abspath%/*}/" >/dev/null 2>/dev/null && pwd -P)
		abspath=$dirname/${abspath##*/}
	fi

	if [[ -d $dirname && -e $abspath ]]; then
		printf '%s\n' "$abspath"
	else
		printf 'invalid path: %s\n' "$path" >&2
		exit 1
	fi
}

# establish repository metadata and directory handling
# shellcheck disable=SC2155
gather_repo_metadata() {
	# whether or not transcrypt is already configured
	readonly INSTALLED_VERSION=$(git config --get --local transcrypt.version 2>/dev/null)

	# the current git repository's top-level directory
	readonly REPO=$(git rev-parse --show-toplevel 2>/dev/null)

	# whether or not a HEAD revision exists
	readonly HEAD_EXISTS=$(git rev-parse --verify --quiet HEAD 2>/dev/null)

	# https://github.com/RichiH/vcsh
	# whether or not the git repository is running under vcsh
	readonly IS_VCSH=$(git config --get --local --bool vcsh.vcsh 2>/dev/null)

	# whether or not the git repository is bare
	readonly IS_BARE=$(git rev-parse --is-bare-repository 2>/dev/null || printf 'false')

	# the current git repository's .git directory
	readonly RELATIVE_GIT_DIR=$(git rev-parse --git-dir 2>/dev/null || printf '')
	readonly GIT_DIR=$(realpath "$RELATIVE_GIT_DIR" 2>/dev/null)

	# Respect transcrypt.crypt-dir if present. Default to crypt/ in Git dir
	readonly CRYPT_DIR=$(git config transcrypt.crypt-dir 2>/dev/null || printf '%s/crypt' "${RELATIVE_GIT_DIR}")

	# respect core.hooksPath setting, without trailing slash. Fall back to default hooks dir
	readonly GIT_HOOKS=$(git config core.hooksPath | sed 's:/*$::' 2>/dev/null || printf "%s/hooks" "${RELATIVE_GIT_DIR}")

	# the current git repository's gitattributes file
	local CORE_ATTRIBUTES
	CORE_ATTRIBUTES=$(git config --get --local --path core.attributesFile 2>/dev/null || git config --get --path core.attributesFile 2>/dev/null || printf '')
	if [[ $CORE_ATTRIBUTES ]]; then
		readonly GIT_ATTRIBUTES=$CORE_ATTRIBUTES
	elif [[ $IS_BARE == 'true' ]] || [[ $IS_VCSH == 'true' ]]; then
		readonly GIT_ATTRIBUTES="${GIT_DIR}/info/attributes"
	else
		readonly GIT_ATTRIBUTES="${REPO}/.gitattributes"
	fi

	# fetch list of context names already configured or in .gitattributes
	readonly CONFIGURED_CONTEXTS=$(get_contexts_from_git_config)
	readonly GITATTRIBUTES_CONTEXTS=$(get_contexts_from_git_attributes)
}

# print a message to stderr
warn() {
	local fmt="$1"
	shift
	# shellcheck disable=SC2059
	printf "transcrypt: $fmt\n" "$@" >&2
}

# print a message to stderr and exit with either
# the given status or that of the most recent command
die() {
	local st="$?"
	if [[ "$1" != *[^0-9]* ]]; then
		st="$1"
		shift
	fi
	warn "$@"
	exit "$st"
}

# return context name if $1 has format 'context=name-of-context' else empty string
extract_context_name_from_name_value_arg() {
	local before_last_equals=${1%=*}
	local after_first_equals=${1#*=}
	if [[ "$before_last_equals" == "context" ]]; then
		echo "$after_first_equals"
	fi
	echo ''
}

derive_context_config_group() {
	local context=${1:-}
	if [[ ! $context ]] || [[ $context == 'default' ]]; then
		echo ''
	else
		echo ".$context" # Note leading period
	fi
}

# Internal function that returns a list of filenames for encrypted files in the
# repo, where the filenames are verbatim and not quoted in any way even if they
# contain unusual characters like double-quotes, backslash and control
# characters. We must avoid quoting of filenames to support names containing
# double quotes. #173
_list_encrypted_files() {
	local strict_context=${1:-}

	IFS=$'\n'
	# List files with -z option to disable quoting of filenames, then
	# immediately convert NUL-delimited filenames to be newline-delimited to be
	# compatibility with bash variables
	for file in $(git ls-files -z | tr '\0' '\n'); do
		# Check for the suffix ': filter: crypt' that identifies encrypted file
		local check
		check=$(git check-attr filter "$file" 2>/dev/null)

		# Only output names of encrypted files matching the context, either
		# strictly (if $1 = "true") or loosely (if $1 is false or unset)
		if [[ "$strict_context" == "true" ]] &&
			[[ "$check" == *": filter: crypt${CONTEXT_CRYPT_SUFFIX:-}" ]]; then
			echo "$file"
		elif [[ "$check" == *": filter: crypt${CONTEXT_CRYPT_SUFFIX:-}"* ]]; then
			echo "$file"
		fi
	done
}

# Detect OpenSSL major version 3 or later which requires a compatibility
# work-around to include the prefix 'Salted__' and salt value when encrypting.
#
# Note that the LibreSSL project's version of the openssl command does NOT
# require this work-around for major version 3.
#
# See #133 #147
is_salt_prefix_workaround_required() {
	openssl_path=$(git config --get --local transcrypt.openssl-path 2>/dev/null || printf '%s' "$openssl_path")

	openssl_project=$($openssl_path version | cut -d' ' -f1)
	openssl_major_version=$($openssl_path version | cut -d' ' -f2 | cut -d'.' -f1)

	if [ "$openssl_project" == "OpenSSL" ] && [ "$openssl_major_version" -ge "3" ]; then
		echo 'true'
	else
		echo ''
	fi
}

# The `decryption -> encryption` process on an unchanged file must be
# deterministic for everything to work transparently. To do that, the same
# salt must be used each time we encrypt the same file. An HMAC has been
# proven to be a PRF, so we generate an HMAC-SHA256 for each decrypted file
# (keyed with a combination of the filename and transcrypt password), and
# then use the last 16 bytes of that HMAC for the file's unique salt.

# shellcheck disable=SC2155
readonly IS_PRINTF_BIN_SUPPORTED=$([[ "$(echo -n "41" | sed "s/../\\\\x&/g" | xargs -0 printf "%b")" == "A" ]] && echo 'true' || echo 'false')

# Apply one of three methods to convert a hex string to binary data, or
hex_to_bin() {
	# alternative 1 but xxd often only comes with a vim install
	if command -v "xxd" >/dev/null; then
		xxd -r -p
	# alternative 2, but requires printf that supports "%b"
	# (macOS /usr/bin/printf doesn't)
	elif $IS_PRINTF_BIN_SUPPORTED; then
		sed "s/../\\\\x&/g" | xargs -0 printf "%b"
	# alternative 3 as perl is fairly common
	elif command -v "perl" >/dev/null; then
		perl -pe "s/([0-9A-Fa-f]{2})/chr(hex(\$1))/eg"
	else
		die 'required command not found: xxd, or printf that supports "%%b", or perl'
	fi
}

git_clean() {
	context=$(extract_context_name_from_name_value_arg "$1")
	[[ "$context" ]] && shift

	filename=$1
	# ignore empty files
	if [[ ! -s $filename ]]; then
		return
	fi
	# cache STDIN to test if it's already encrypted
	tempfile=$(mktemp 2>/dev/null || mktemp -t tmp)
	trap 'rm -f "$tempfile"' EXIT
	tee "$tempfile" &>/dev/null
	# the first bytes of an encrypted file are always "Salted" in Base64
	# The `head + LC_ALL=C tr` command handles binary data in old and new Bash (#116)
	firstbytes=$(head -c8 "$tempfile" | LC_ALL=C tr -d '\0')
	if [[ $firstbytes == "U2FsdGVk" ]]; then
		cat "$tempfile"
	else
		context_config_group=$(derive_context_config_group "$context")
		cipher=$(git config --get --local "transcrypt${context_config_group}.cipher")
		password=$(load_password "$context_config_group")
		openssl_path=$(git config --get --local transcrypt.openssl-path)
		salt=$("${openssl_path}" dgst -hmac "${filename}:${password}" -sha256 "$tempfile" | tr -d '\r\n' | tail -c16)

		if [ "$(is_salt_prefix_workaround_required)" == "true" ]; then
			# Encrypt the file to base64, ensuring it includes the prefix 'Salted__' with the salt. #133
			(
				echo -n "Salted__" && echo -n "$salt" | hex_to_bin &&
					# Encrypt file to binary ciphertext
					ENC_PASS=$password "$openssl_path" enc -e "-${cipher}" -md MD5 -pass env:ENC_PASS -S "$salt" -in "$tempfile" \
						2> >(sed -E '/(deprecated key derivation used|-pbkdf2 would be better)/d' 1>&2)
			) |
				openssl base64
		else
			# Encrypt file to base64 ciphertext
			ENC_PASS=$password "$openssl_path" enc -e -a "-${cipher}" -md MD5 -pass env:ENC_PASS -S "$salt" -in "$tempfile" \
				2> >(sed -E '/(deprecated key derivation used|-pbkdf2 would be better)/d' 1>&2)
		fi
	fi
}

git_smudge() {
	tempfile=$(mktemp 2>/dev/null || mktemp -t tmp)
	trap 'rm -f "$tempfile"' EXIT
	context=$(extract_context_name_from_name_value_arg "$1")
	context_config_group=$(derive_context_config_group "$context")
	cipher=$(git config --get --local "transcrypt${context_config_group}.cipher")
	password=$(load_password "$context_config_group")
	openssl_path=$(git config --get --local transcrypt.openssl-path)
	tee "$tempfile" | ENC_PASS=$password "$openssl_path" enc -d "-${cipher}" -md MD5 -pass env:ENC_PASS -a 2>/dev/null || cat "$tempfile"
}

git_textconv() {
	context=$(extract_context_name_from_name_value_arg "$1")
	[[ "$context" ]] && shift

	filename=$1
	# ignore empty files
	if [[ ! -s $filename ]]; then
		return
	fi

	context_config_group=$(derive_context_config_group "$context")
	cipher=$(git config --get --local "transcrypt${context_config_group}.cipher")
	password=$(load_password "$context_config_group")
	openssl_path=$(git config --get --local transcrypt.openssl-path)
	ENC_PASS=$password "$openssl_path" enc -d "-${cipher}" -md MD5 -pass env:ENC_PASS -a -in "$filename" 2>/dev/null || cat "$filename"
}

# shellcheck disable=SC2005,SC2002,SC2181
git_merge() {
	context=$(extract_context_name_from_name_value_arg "$1")
	[[ "$context" ]] && shift

	# Get path to transcrypt in this script's directory
	TRANSCRYPT_PATH="$(dirname "$0")/transcrypt"
	# Look up name of local branch/ref to which changes are being merged
	OURS_LABEL=$(git rev-parse --abbrev-ref HEAD)
	# Look up name of the incoming "theirs" branch/ref being merged in.
	# TODO There must be a better way of doing this than relying on this reflog
	#      action environment variable, but I don't know what it is
	if [[ "${GIT_REFLOG_ACTION:-}" = "merge "* ]]; then
		THEIRS_LABEL=$(echo "$GIT_REFLOG_ACTION" | awk '{print $2}')
	fi
	if [[ ! "${THEIRS_LABEL:-}" ]]; then
		THEIRS_LABEL="theirs"
	fi
	# Decrypt BASE $1, LOCAL $2, and REMOTE $3 versions of file being merged
	echo "$(cat "$1" | "${TRANSCRYPT_PATH}" smudge context="$context")" >"$1"
	echo "$(cat "$2" | "${TRANSCRYPT_PATH}" smudge context="$context")" >"$2"
	echo "$(cat "$3" | "${TRANSCRYPT_PATH}" smudge context="$context")" >"$3"
	# Merge the decrypted files to the temp file named by $2
	git merge-file --marker-size="$4" -L "$OURS_LABEL" -L base -L "$THEIRS_LABEL" "$2" "$1" "$3"
	# If the merge was not successful (has conflicts) exit with an error code to
	# leave the partially-merged file in place for a manual merge.
	if [[ "$?" != "0" ]]; then
		exit 1
	fi
	# If the merge was successful (no conflicts) re-encrypt the merged temp file $2
	# which git will then update in the index in a following "Auto-merging" step.
	# We must explicitly encrypt/clean the file, rather than leave Git to do it,
	# because we can otherwise trigger safety check failure errors like:
	#     error: add_cacheinfo failed to refresh for path 'FILE'; merge aborting.
	# To re-encrypt we must first copy the merged file to $5 (the name of the
	# working-copy file) so the crypt `clean` script can generate the correct hash
	# salt based on the file's real name, instead of the $2 temp file name.
	cp "$2" "$5"
	# Now we use the `clean` script to encrypt the merged file contents back to the
	# temp file $2 where Git expects to find the merge result content.
	cat "$5" | "${TRANSCRYPT_PATH}" clean context="$context" "$5" >"$2"
}

# shellcheck disable=SC2155
git_pre_commit() {
	# Transcrypt pre-commit hook: fail if secret file in staging lacks the magic prefix "Salted" in B64
	tmp=$(mktemp)
	IFS=$'\n'
	slow_mode_if_failed() {
		for secret_file in $(_list_encrypted_files); do
			# Skip symlinks, they contain the linked target file path not plaintext
			if [[ -L $secret_file ]]; then
				continue
			fi

			# Get prefix of raw file in Git's index using the :FILENAME revision syntax
			local firstbytes=$(git show :"${secret_file}" | head -c8)
			# An empty file does not need to be, and is not, encrypted
			if [[ $firstbytes == "" ]]; then
				: # Do nothing
			# The first bytes of an encrypted file must be "Salted" in Base64
			elif [[ $firstbytes != "U2FsdGVk" ]]; then
				printf 'Transcrypt managed file is not encrypted in the Git index: %s\n' "$secret_file" >&2
				printf '\n' >&2
				printf 'You probably staged this file using a tool that does not apply' >&2
				printf ' .gitattribute filters as required by Transcrypt.\n' >&2
				printf '\n' >&2
				printf 'Fix this by re-staging the file with a compatible tool or with'
				printf ' Git on the command line:\n' >&2
				printf '\n' >&2
				printf '    git rm --cached -- %s\n' "$secret_file" >&2
				printf '    git add %s\n' "$secret_file" >&2
				printf '\n' >&2
				exit 1
			fi
		done
	}

	# validate file to see if it failed or not, We don't care about the filename currently for speed, we only care about pass/fail, slow_mode_if_failed() is for what failed.
	validate_file() {
		secret_file=${1}
		# Skip symlinks, they contain the linked target file path not plaintext
		if [[ -L $secret_file ]]; then
			return
		fi
		# Get prefix of raw file in Git's index using the :FILENAME revision syntax
		# The first bytes of an encrypted file are always "Salted" in Base64
		local firstbytes=$(git show :"${secret_file}" | head -c8)
		if [[ $firstbytes != "U2FsdGVk" ]]; then
			echo "true" >>"${tmp}"
		fi
	}

	# if bash version is 4.4 or greater than fork to number of threads otherwise run normally
	if [[ "${BASH_VERSINFO[0]}" -ge 4 ]] && [[ "${BASH_VERSINFO[1]}" -ge 4 ]]; then
		num_procs=$(nproc)
		num_jobs="\j"
		for secret_file in $(_list_encrypted_files); do
			while ((${num_jobs@P} >= num_procs)); do
				wait -n
			done
			validate_file "${secret_file}" &
		done
		wait
		if [[ -s ${tmp} ]]; then
			slow_mode_if_failed
			rm -f "${tmp}"
			exit 1
		fi
	else
		slow_mode_if_failed
	fi

	rm -f "${tmp}"
	unset IFS
}

# verify that all requirements have been met
run_safety_checks() {
	# validate that we're in a git repository
	[[ $GIT_DIR ]] || die 'you are not currently in a git repository; did you forget to run "git init"?'

	# Check the context name provided (or 'default') is valid
	full_context_regex="^${CONTEXT_REGEX}$"
	if [[ ! $CONTEXT =~ $full_context_regex ]]; then
		warn "context name '${CONTEXT}' is invalid"
		echo "Must be lowercase ASCII, start with a letter, then zero or more letters or numbers. A hyphen (-) seperator is allowed"
		echo "Examples: admin  admins-only  super-user  staging  production  top-secret  abc-123-xyz"
		exit 1
	fi

	# exit if transcrypt is not in the required state
	if [[ $requires_existing_config ]] && [[ ! $CONFIGURED_CONTEXTS ]]; then
		die 1 'the current repository is not configured'
	fi

	# check for dependencies
	for cmd in {column,grep,mktemp,"${openssl_path}",sed,tee}; do
		command -v "$cmd" >/dev/null || die 'required command "%s" was not found' "$cmd"
	done

	# check for a working method to convert a hex string to binary data
	if [ "$(is_salt_prefix_workaround_required)" == "true" ]; then
		echo -n "41" | hex_to_bin >/dev/null
	fi

	# ensure the repository is clean (if it has a HEAD revision) so we can force
	# checkout files without the destruction of uncommitted changes
	if [[ $requires_clean_repo ]] && [[ $HEAD_EXISTS ]] && [[ $IS_BARE == 'false' ]]; then
		# ensure index is up-to-date before dirty check
		git update-index -q --really-refresh
		# check if the repo is dirty
		if ! git diff-index --quiet HEAD --; then
			warn 'the repo is dirty; commit or stash your changes before running transcrypt\n'
			# Output a human friendly summary of dirty files, with fallback to
			# less friendly output formats if nicer ones aren't supported
			git diff-index --name-status HEAD -- 2>/dev/null ||
				git diff-index --stat HEAD -- 2>/dev/null ||
				git diff-index HEAD --
			exit 1
		fi
	fi
}

# unset the cipher variable if it is not supported by openssl
validate_cipher() {
	local list_cipher_commands
	if "${openssl_path}" list-cipher-commands &>/dev/null; then
		# OpenSSL < v1.1.0
		list_cipher_commands="${openssl_path} list-cipher-commands"
	else
		# OpenSSL >= v1.1.0
		list_cipher_commands="${openssl_path} list -cipher-commands"
	fi

	local supported
	supported=$($list_cipher_commands | tr -s ' ' '\n' | grep -Fx "$cipher") || true
	if [[ ! $supported ]]; then
		if [[ $interactive ]]; then
			printf '"%s" is not a valid cipher; choose one of the following:\n\n' "$cipher"
			$list_cipher_commands | column -c 80
			printf '\n'
			cipher=''
		else
			# shellcheck disable=SC2016
			die 1 '"%s" is not a valid cipher; see `%s`' "$cipher" "$list_cipher_commands"
		fi
	fi
}

# ensure we have a cipher to encrypt with
get_cipher() {
	while [[ ! $cipher ]]; do
		local answer=
		if [[ $interactive ]]; then
			printf 'Encrypt using which cipher? [%s] ' "$DEFAULT_CIPHER"
			read -r answer
		fi

		# use the default cipher if the user gave no answer;
		# otherwise verify the given cipher is supported by openssl
		if [[ ! $answer ]]; then
			cipher=$DEFAULT_CIPHER
		else
			cipher=$answer
			validate_cipher
		fi
	done
}

# ensure we have a password to encrypt with
get_password() {
	while [[ ! $password ]]; do
		local answer=
		if [[ $interactive ]]; then
			printf 'Generate a random password? [Y/n] '
			read -r -n 1 -s answer
			printf '\n'
		fi

		# generate a random password if the user answered yes;
		# otherwise prompt the user for a password
		if [[ $answer =~ $YES_REGEX ]] || [[ ! $answer ]]; then
			local password_length=30
			local random_base64
			random_base64=$(${openssl_path} rand -base64 $password_length)
			password=$random_base64
		else
			printf 'Password: '
			read -r password
			[[ $password ]] || printf 'no password was specified\n'
		fi
	done
}

# confirm the transcrypt configuration
confirm_configuration() {
	local answer=

	printf '\nRepository metadata:\n\n'
	[[ ! $REPO ]] || printf '  GIT_WORK_TREE:  %s\n' "$REPO"
	printf '  GIT_DIR:        %s\n' "$GIT_DIR"
	printf '  GIT_ATTRIBUTES: %s\n\n' "$GIT_ATTRIBUTES"
	printf 'The following configuration will be saved:\n\n'
	printf '  CONTEXT:  %s\n' "$CONTEXT"
	printf '  CIPHER:   %s\n' "$cipher"
	printf '  PASSWORD: %s\n\n' "$password"
	printf 'Does this look correct? [Y/n] '
	read -r -n 1 -s answer

	# exit if the user did not confirm
	if [[ $answer =~ $YES_REGEX ]] || [[ ! $answer ]]; then
		printf '\n\n'
	else
		printf '\n'
		die 1 'configuration has been aborted'
	fi
}

# confirm the rekey configuration
confirm_rekey() {
	local answer=

	printf '\nRepository metadata:\n\n'
	[[ ! $REPO ]] || printf '  GIT_WORK_TREE:  %s\n' "$REPO"
	printf '  GIT_DIR:        %s\n' "$GIT_DIR"
	printf '  GIT_ATTRIBUTES: %s\n\n' "$GIT_ATTRIBUTES"
	printf 'The following configuration will be saved:\n\n'
	printf '  CONTEXT:  %s\n' "$CONTEXT"
	printf '  CIPHER:   %s\n' "$cipher"
	printf '  PASSWORD: %s\n\n' "$password"
	printf 'You are about to re-encrypt all encrypted files using new credentials.\n'
	printf 'Once you do this, their historical diffs will no longer display in plain text.\n\n'
	printf 'Proceed with rekey? [y/N] '
	read -r answer

	# only rekey if the user explicitly confirmed
	if [[ $answer =~ $YES_REGEX ]]; then
		printf '\n'
	else
		die 1 'rekeying has been aborted'
	fi
}

# automatically stage rekeyed files in preparation for the user to commit them
stage_rekeyed_files() {
	local encrypted_files
	encrypted_files=$(git ls-crypt)
	if [[ $encrypted_files ]] && [[ $IS_BARE == 'false' ]]; then
		# touch all encrypted files to prevent stale stat info
		cd "$REPO" >/dev/null || die 1 'could not change into the "%s" directory' "$REPO"
		# shellcheck disable=SC2086
		touch $encrypted_files
		# shellcheck disable=SC2086
		git update-index --add -- $encrypted_files

		printf '***  rekeyed files have been staged  ***\n'
		printf '*** COMMIT THESE CHANGES RIGHT AWAY! ***\n\n'
	fi
}

# save helper scripts under the repository's git directory
save_helper_scripts() {
	mkdir -p "${CRYPT_DIR}"

	local current_transcrypt
	current_transcrypt=$(realpath "$0" 2>/dev/null)
	cp "$current_transcrypt" "${CRYPT_DIR}/transcrypt"

	# make scripts executable
	for script in {transcrypt,}; do
		chmod 0755 "${CRYPT_DIR}/${script}"
	done
}

# save helper hooks under the repository's git directory
save_helper_hooks() {
	if [[ $rekey ]]; then
		return 0 # Bypass helper hook installation on rekey
	fi

	# Install pre-commit-crypt hook script
	[[ ! -d "${GIT_HOOKS}" ]] && mkdir -p "${GIT_HOOKS}"
	pre_commit_hook_installed="${GIT_HOOKS}/pre-commit-crypt"
	cat <<-'EOF' >"$pre_commit_hook_installed"
		#!/usr/bin/env bash
		# Transcrypt pre-commit hook: fail if secret file in staging lacks the magic prefix "Salted" in B64
		RELATIVE_GIT_DIR=$(git rev-parse --git-dir 2>/dev/null || printf '')
		CRYPT_DIR=$(git config transcrypt.crypt-dir 2>/dev/null || printf '%s/crypt' "${RELATIVE_GIT_DIR}")
		"${CRYPT_DIR}/transcrypt" pre_commit
	EOF

	# Activate hook by copying it to the pre-commit script name, but only if
	# the global pre-commit hook is not already present
	pre_commit_hook="${GIT_HOOKS}/pre-commit"
	if [[ -f "$pre_commit_hook" ]]; then
		# Nothing to do if our pre-commit hook is already installed
		hook_md5=$("${openssl_path}" md5 -hex <"$pre_commit_hook")
		installed_md5=$("${openssl_path}" md5 -hex <"$pre_commit_hook_installed")
		if [[ "$hook_md5" = "$installed_md5" ]]; then
			: # no-op
		else
			printf 'WARNING:\n' >&2
			printf 'Cannot install Git pre-commit hook script because file already exists: %s\n' "$pre_commit_hook" >&2
			printf 'Please manually install the pre-commit script saved as: %s\n' "$pre_commit_hook_installed" >&2
			printf '\n'
		fi
	else
		cp "$pre_commit_hook_installed" "$pre_commit_hook"
		chmod 0755 "$pre_commit_hook"
	fi
}

# write the configuration to the repository's git config
save_configuration() {
	# prevent clobbering existing configuration
	# shellcheck disable=SC2086
	if [[ $upgrade ]]; then
		: # Bypass safety check on upgrade; we know we just called uninstall_transcrypt
	elif [[ $rekey ]]; then
		: # Bypass safety check on rekey
	elif is_item_in_array "$CONTEXT" ${CONFIGURED_CONTEXTS}; then
		if [[ "$CONTEXT" = 'default' ]]; then
			die 1 "the current repository is already configured; see 'transcrypt --display'"
		else
			die 1 "the current repository is already configured${CONTEXT_DESCRIPTION}; see 'transcrypt --context=$CONTEXT --display'"
		fi
	fi

	save_helper_scripts
	save_helper_hooks

	# write the encryption info
	git config transcrypt.version "$VERSION"
	git config "transcrypt${CONTEXT_CONFIG_GROUP}.cipher" "$cipher"
	save_password "$password" "$CONTEXT_CONFIG_GROUP"
	git config transcrypt.openssl-path "$openssl_path"

	# write the filter settings. Sorry for the horrific quote escaping below...
	# shellcheck disable=SC2016
	transcrypt_path='"$(git config transcrypt.crypt-dir 2>/dev/null || printf %s/crypt ""$(git rev-parse --git-dir)"")"/transcrypt'

	# Ensure filter attributes are always set for the default (unspecified) context
	git config filter.crypt.clean "$transcrypt_path clean context=default %f"
	git config filter.crypt.smudge "$transcrypt_path smudge context=default"
	git config diff.crypt.textconv "$transcrypt_path textconv context=default"
	git config merge.crypt.driver "$transcrypt_path merge context=default %O %A %B %L %P"

	# Also set filter attributes for a non-default context, if necessary
	if [[ ! "$CONTEXT" = 'default' ]]; then
		git config filter.crypt"${CONTEXT_CRYPT_SUFFIX}".clean "$transcrypt_path clean context=$CONTEXT %f"
		git config filter.crypt"${CONTEXT_CRYPT_SUFFIX}".smudge "$transcrypt_path smudge context=$CONTEXT"
		git config diff.crypt"${CONTEXT_CRYPT_SUFFIX}".textconv "$transcrypt_path textconv context=$CONTEXT"
		git config merge.crypt"${CONTEXT_CRYPT_SUFFIX}".driver "$transcrypt_path merge context=$CONTEXT %O %A %B %L %P"
	fi

	git config filter.crypt.required 'true'
	git config diff.crypt.cachetextconv 'true'
	git config diff.crypt.binary 'true'
	git config merge.renormalize 'true'
	git config merge.crypt.name 'Merge transcrypt secret files'

	# add git alias for listing ALL encrypted files regardless of context
	git config alias.ls-crypt "!$transcrypt_path --list"

	# add a git alias for listing encrypted files in specific context, including 'default'
	if [[ "$CONTEXT" = 'default' ]]; then
		# List files with gitattribute 'filter=crypt'
		git config alias.ls-crypt-default "!$transcrypt_path --list"
	else
		# List files with gitattribute 'filter=crypt-<CONTEXT>'
		git config "alias.ls-crypt-${CONTEXT}" "!$transcrypt_path --context=${CONTEXT} --list"
	fi
}

# display the current configuration settings
display_configuration() {
	local current_cipher
	current_cipher=$(git config --get --local "transcrypt${CONTEXT_CONFIG_GROUP}.cipher")
	local current_password
	current_password=$(load_password "$CONTEXT_CONFIG_GROUP")
	local escaped_password=${current_password//\'/\'\\\'\'}

	contexts_count="$(count_items_in_list "$CONFIGURED_CONTEXTS")"

	printf 'The current repository was configured using transcrypt version %s\n' "$INSTALLED_VERSION"
	printf "and has the following configuration%s:\n\n" "$CONTEXT_DESCRIPTION"
	[[ ! $REPO ]] || printf '  GIT_WORK_TREE:  %s\n' "$REPO"
	printf '  GIT_DIR:        %s\n' "$GIT_DIR"
	printf '  GIT_ATTRIBUTES: %s\n\n' "$GIT_ATTRIBUTES"
	printf '  CONTEXT:  %s\n' "$CONTEXT"
	printf '  CIPHER:   %s\n' "$current_cipher"
	printf '  PASSWORD: %s\n\n' "$current_password"
	if [[ "$contexts_count" -gt "1" ]]; then
		printf 'The repository has %s contexts: %s\n\n' "$contexts_count" "$CONFIGURED_CONTEXTS"
	fi
	printf "Copy and paste the following command to initialize a cloned repository%s:\n\n" "$CONTEXT_DESCRIPTION"
	if [[ $CONTEXT != 'default' ]]; then
		printf "  transcrypt -C $CONTEXT -c %s -p '%s'\n" "$current_cipher" "$escaped_password"
	else
		printf "  transcrypt -c %s -p '%s'\n" "$current_cipher" "$escaped_password"
	fi
}

# remove transcrypt-related settings from the repository's git config
clean_gitconfig() {
	git config --remove-section transcrypt"${CONTEXT_CONFIG_GROUP}" 2>/dev/null || true

	git config --remove-section filter.crypt"${CONTEXT_CRYPT_SUFFIX}" 2>/dev/null || true
	git config --remove-section diff.crypt"${CONTEXT_CRYPT_SUFFIX}" 2>/dev/null || true
	git config --remove-section merge.crypt"${CONTEXT_CRYPT_SUFFIX}" 2>/dev/null || true
}

# Remove from the local Git DB any objects containing the cached plaintext of
# secret files, created due to the setting diff.crypt.cachetextconv='true'
remove_cached_plaintext() {
	# Delete ref to cached plaintext objects, to leave these objects
	# unreferenced and available for removal
	git update-ref -d refs/notes/textconv/crypt

	# Remove ANY unreferenced objects in Git's object DB (packed or unpacked),
	# to ensure that cached plaintext objects are also removed.
	# The vital sub-commands equivalents we require this `gc` command to do are:
	# `git prune`, `git repack -ad`
	git gc --prune=now --quiet
}

# force the checkout of any files with the crypt filter applied to them;
# this will decrypt existing encrypted files if you've just cloned a repository,
# or it will encrypt locally decrypted files if you've just flushed the credentials
force_checkout() {
	# make sure a HEAD revision exists
	if [[ $HEAD_EXISTS ]] && [[ $IS_BARE == 'false' ]]; then
		# this would normally delete uncommitted changes in the working directory,
		# but we already made sure the repo was clean during the safety checks
		local encrypted_files
		encrypted_files=$(git "ls-crypt-${CONTEXT}")
		cd "$REPO" >/dev/null || die 1 'could not change into the "%s" directory' "$REPO"
		IFS=$'\n'
		for file in $encrypted_files; do
			rm -f "$file"
			git checkout --force HEAD -- "$file" >/dev/null
		done
		unset IFS
	fi
}

# remove the locally cached encryption credentials and
# re-encrypt any files that had been previously decrypted
flush_credentials() {
	local answer=

	if [[ $interactive ]]; then
		printf 'You are about to flush the local credentials; make sure you have saved them elsewhere.\n'
		printf 'All previously decrypted files will revert to their encrypted form, and your\n'
		printf 'repo will be garbage collected to remove any cached plaintext of secret files.\n\n'
		printf 'Proceed with credential flush? [y/N] '
		read -r answer
		printf '\n'
	else
		# although destructive, we should support the --yes option
		answer='y'
	fi

	# only flush if the user explicitly confirmed
	if [[ $answer =~ $YES_REGEX ]]; then
		clean_gitconfig

		remove_cached_plaintext

		# re-encrypt any files that had been previously decrypted
		force_checkout

		# Unset the ls-crypt alias for the current context
		# We must do this after the force checkout, which relies on ls-crypt
		git config --unset alias.ls-crypt"${CONTEXT_CRYPT_SUFFIX}" 2>/dev/null || true

		# Also remove ls-crypt-default alias when removing default context
		if [[ "$CONTEXT" = 'default' ]]; then
			git config --unset alias.ls-crypt-default 2>/dev/null || true
		fi

		printf 'The local transcrypt credentials have been successfully flushed.\n'
	else
		die 1 'flushing of credentials has been aborted'
	fi
}

# remove all transcrypt configuration from the repository
uninstall_transcrypt() {
	local answer=

	if [[ $interactive ]]; then
		printf 'You are about to remove all transcrypt configuration from your repository.\n'
		printf 'All previously encrypted files will remain decrypted in this working copy, but your\n'
		printf 'repo will be garbage collected to remove any cached plaintext of secret files.\n\n'
		if [[ $(count_items_in_list "$CONFIGURED_CONTEXTS") -gt "1" ]]; then
			printf 'Proceed with uninstall of all contexts (%s)? [y/N] ' "$CONFIGURED_CONTEXTS"
		else
			printf 'Proceed with uninstall? [y/N] '
		fi
		read -r answer
		printf '\n'
	else
		# although destructive, we should support the --yes option
		answer='y'
	fi

	# only uninstall if the user explicitly confirmed
	if [[ $answer =~ $YES_REGEX ]]; then
		clean_gitconfig

		if [[ ! $upgrade ]]; then
			remove_cached_plaintext
		fi

		# touch all encrypted files to prevent stale stat info
		local encrypted_files
		encrypted_files=$(git ls-crypt)
		if [[ $encrypted_files ]] && [[ $IS_BARE == 'false' ]]; then
			cd "$REPO" >/dev/null || die 1 'could not change into the "%s" directory' "$REPO"
			# shellcheck disable=SC2086
			touch $encrypted_files
		fi

		# remove helper scripts
		# Keep obsolete clean,smudge,textconv,merge refs here to remove them on upgrade
		for script in {transcrypt,clean,smudge,textconv,merge}; do
			[[ ! -f "${CRYPT_DIR}/${script}" ]] || rm "${CRYPT_DIR}/${script}"
		done
		[[ ! -d "${CRYPT_DIR}" ]] || rmdir "${CRYPT_DIR}"

		# rename helper hooks (don't delete, in case user has custom changes)
		pre_commit_hook="${GIT_HOOKS}/pre-commit"
		pre_commit_hook_installed="${GIT_HOOKS}/pre-commit-crypt"
		if [[ -f "$pre_commit_hook" ]]; then
			hook_md5=$("${openssl_path}" md5 -hex <"$pre_commit_hook")
			installed_md5=$("${openssl_path}" md5 -hex <"$pre_commit_hook_installed")
			if [[ "$hook_md5" = "$installed_md5" ]]; then
				rm "$pre_commit_hook"
			else
				printf 'WARNING: Cannot safely disable Git pre-commit hook %s please check it yourself\n' "$pre_commit_hook"
			fi
		fi
		[[ -f "$pre_commit_hook_installed" ]] && rm "$pre_commit_hook_installed"

		# remove context settings: cipher & password config, ls-crypt alias variant,
		# crypt filter/diff/merge attributes. We do it here instead of `clean_gitconfig`
		# to avoid interfering with flushing of credentials
		for context in $CONFIGURED_CONTEXTS; do
			git config --unset alias.ls-crypt-"${context}" 2>/dev/null || true

			git config --remove-section transcrypt."${context}" 2>/dev/null || true

			git config --remove-section filter.crypt-"${context}" 2>/dev/null || true
			git config --remove-section diff.crypt-"${context}" 2>/dev/null || true
			git config --remove-section merge.crypt-"${context}" 2>/dev/null || true
		done

		# remove the `git ls-crypt` global alias. We must do this late, because
		# we need it to list the files to touch above.
		git config --unset alias.ls-crypt 2>/dev/null || true

		# remove the alias section if it's now empty
		local alias_values
		alias_values=$(git config --get-regex --local 'alias\..*') || true
		if [[ ! $alias_values ]]; then
			git config --remove-section alias 2>/dev/null || true
		fi

		# unset merge.renormalize if all transcrypt configs are now removed
		local transcrypt_values
		transcrypt_values=$(git config --get-regex --local 'transcrypt\..*') || true
		if [[ ! $transcrypt_values ]]; then
			git config --unset merge.renormalize
		fi

		# remove the merge section if it's now empty
		local merge_values
		merge_values=$(git config --get-regex --local 'merge\..*') || true
		if [[ ! $merge_values ]]; then
			git config --remove-section merge 2>/dev/null || true
		fi

		# remove any defined crypt patterns in gitattributes
		case $OSTYPE in
		darwin*)
			/usr/bin/sed -i '' "/filter=crypt/d" "$GIT_ATTRIBUTES"
			;;
		linux*)
			sed -i "/filter=crypt/d" "$GIT_ATTRIBUTES"
			;;
		esac

		if [[ ! $upgrade ]]; then
			printf 'The transcrypt configuration has been completely removed from the repository.\n'
		fi
	else
		die 1 'uninstallation has been aborted'
	fi
}

# uninstall and re-install transcrypt to upgrade scripts and update configuration
upgrade_transcrypt() {
	# Fail with an error if we cannot read the existing config
	if [[ ! $INSTALLED_VERSION ]]; then
		die 1 'no existing transcrypt configuration found'
	fi

	if [[ $interactive ]]; then
		printf 'You are about to upgrade the transcrypt scripts in your repository.\n'
		printf 'Your configuration settings will not be changed.\n\n'
		printf ' Current version: %s\n' "$INSTALLED_VERSION"
		printf 'Upgraded version: %s\n\n' "$VERSION"
		printf 'Proceed with upgrade? [y/N] '
		read -r answer
		printf '\n'

		if [[ $answer =~ $YES_REGEX ]]; then
			# User confirmed, don't prompt again
			interactive=''
		else
			# User did not confirm, exit
			# Exit if user did not confirm
			die 1 'upgrade has been aborted'
		fi
	fi

	# Keep current cipher and password
	cipher=$(git config --get --local "transcrypt${CONTEXT_CONFIG_GROUP}.cipher")
	password=$(load_password "$CONTEXT_CONFIG_GROUP")
	# Keep current openssl-path, or set to default if no existing value
	openssl_path=$(git config --get --local transcrypt.openssl-path 2>/dev/null || printf '%s' "$openssl_path")

	# Keep contents of .gitattributes
	ORIG_GITATTRIBUTES=$(cat "$GIT_ATTRIBUTES")

	# Keep current cipher and password for each context
	ORIG_CONFIGS=()
	for context_name in $CONFIGURED_CONTEXTS; do
		if [[ "$context_name" = 'default' ]]; then
			cipher=$(git config --get --local transcrypt.cipher)
			password=$(git config --get --local transcrypt.password)
		else
			cipher=$(git config --get --local transcrypt."${context_name}".cipher)
			password=$(git config --get --local transcrypt."${context_name}".password)
		fi
		ORIG_CONFIGS+=("${context_name}|${cipher}|${password}")
	done

	uninstall_transcrypt

	# Reconfigure cipher and password for each context
	for orig_config_line in "${ORIG_CONFIGS[@]}"; do
		context=$(echo "$orig_config_line" | awk 'BEGIN { FS = "|" }; { print $1 }')
		cipher=$(echo "$orig_config_line" | awk 'BEGIN { FS = "|" }; { print $2 }')
		password=$(echo "$orig_config_line" | awk 'BEGIN { FS = "|" }; { print $3 }')

		set_context_globals # This prepares all the variables needed to save config
		save_configuration
	done

	# Re-instate contents of .gitattributes
	echo "$ORIG_GITATTRIBUTES" >"$GIT_ATTRIBUTES"

	# Update .gitattributes for transcrypt'ed files to include "merge=crypt" config
	case $OSTYPE in
	darwin*)
		/usr/bin/sed -i '' 's/diff=crypt$/diff=crypt merge=crypt/' "$GIT_ATTRIBUTES"
		;;
	linux*)
		sed -i 's/diff=crypt$/diff=crypt merge=crypt/' "$GIT_ATTRIBUTES"
		;;
	esac

	printf 'Upgrade is complete\n'

	LATEST_GITATTRIBUTES=$(cat "$GIT_ATTRIBUTES")
	if [[ "$LATEST_GITATTRIBUTES" != "$ORIG_GITATTRIBUTES" ]]; then
		printf '\nYour gitattributes file has been updated with the latest recommended values.\n'
		printf 'Please review and commit the new values in:\n'
		printf '%s\n' "$GIT_ATTRIBUTES"
	fi
}

# list all of the currently encrypted files in the repository
list_files() {
	if [[ $IS_BARE == 'false' ]]; then
		cd "$REPO" >/dev/null || die 1 'could not change into the "%s" directory' "$REPO"
		_list_encrypted_files true
	fi
}

# show the raw file as stored in the git commit object
show_raw_file() {
	if [[ -f $show_file ]]; then
		# ensure the file is currently being tracked
		local escaped_file=${show_file//\//\\\/}
		file_paths=$(_list_encrypted_files | grep "$escaped_file")
		if [[ -z "$file_paths" ]]; then
			die 1 'the file "%s" is not currently being tracked by git' "$show_file"
		fi
	elif [[ $show_file == '*' ]]; then
		file_paths=$(_list_encrypted_files)
	else
		die 1 'the file "%s" does not exist' "$show_file"
	fi

	IFS=$'\n'
	for file in $file_paths; do
		printf '==> %s <==\n' "$file" >&2
		git --no-pager show HEAD:"$file" --no-textconv
		printf '\n' >&2
	done
	unset IFS
}

# export password and cipher to a gpg encrypted file
export_gpg() {
	# check for dependencies
	command -v gpg >/dev/null || die 'required command "gpg" was not found'

	# ensure the recipient key exists
	if ! gpg --list-keys "$gpg_recipient" 2>/dev/null; then
		die 1 'GPG recipient key "%s" does not exist' "$gpg_recipient"
	fi

	local current_cipher
	current_cipher=$(git config --get --local "transcrypt${CONTEXT_CONFIG_GROUP}.cipher")
	local current_password
	current_password=$(load_password "$CONTEXT_CONFIG_GROUP")
	mkdir -p "${CRYPT_DIR}"

	local gpg_encrypt_cmd="gpg --batch --recipient $gpg_recipient --trust-model always --yes --armor --quiet --encrypt -"
	printf 'password=%s\ncipher=%s\n' "$current_password" "$current_cipher" | $gpg_encrypt_cmd >"${CRYPT_DIR}/${gpg_recipient}.asc"
	printf "The transcrypt configuration has been encrypted and exported to:\n%s/crypt/%s.asc\n" "$GIT_DIR" "$gpg_recipient"
}

# import password and cipher from a gpg encrypted file
import_gpg() {
	# check for dependencies
	command -v gpg >/dev/null || die 'required command "gpg" was not found'

	local path
	if [[ -f "${CRYPT_DIR}/${gpg_import_file}" ]]; then
		path="${CRYPT_DIR}/${gpg_import_file}"
	elif [[ -f "${CRYPT_DIR}/${gpg_import_file}.asc" ]]; then
		path="${CRYPT_DIR}/${gpg_import_file}.asc"
	elif [[ ! -f $gpg_import_file ]]; then
		die 1 'the file "%s" does not exist' "$gpg_import_file"
	else
		path="$gpg_import_file"
	fi

	local configuration=''
	local safety_counter=0 # fix for intermittent 'no secret key' decryption failures
	while [[ ! $configuration ]]; do
		configuration=$(gpg --batch --quiet --decrypt "$path")

		safety_counter=$((safety_counter + 1))
		if [[ $safety_counter -eq 3 ]]; then
			die 1 'unable to decrypt the file "%s"' "$path"
		fi
	done

	cipher=$(printf '%s' "$configuration" | grep '^cipher' | cut -d'=' -f 2-)
	password=$(printf '%s' "$configuration" | grep '^password' | cut -d'=' -f 2-)
}

# Echo space-delimited list of context names defined in the git config
get_contexts_from_git_config() {
	config_names=$(git config --local --name-only --list | grep transcrypt)
	extract_context_name_regex="transcrypt\.(${CONTEXT_REGEX}).password"
	contexts=()
	for name in $config_names; do
		if [[ "$name" = "transcrypt.password" ]]; then
			contexts+=('default')
		elif [[ $name =~ $extract_context_name_regex ]]; then
			contexts+=("${BASH_REMATCH[1]}")
		fi
	done
	if [[ "${contexts:-}" ]]; then
		trim "$(printf "%q " "${contexts[@]}")"
	fi
}

# Echo space-delimited list of context names defined in the .gitattributes file
get_contexts_from_git_attributes() {
	if [[ -f $GIT_ATTRIBUTES ]]; then
		# Capture contents of .gitattributes without comments (leading # hash)
		attr_lines=$(sed '/^.*#/d' <"$GIT_ATTRIBUTES")
		extract_context_name_regex="filter=crypt-(${CONTEXT_REGEX})"
		recognise_crypt_regex="filter=crypt"
		contexts=()
		IFS=$'\n'
		for attr_line in ${attr_lines}; do
			if [[ $attr_line =~ $extract_context_name_regex ]]; then
				contexts+=("${BASH_REMATCH[1]}")
			elif [[ $attr_line =~ $recognise_crypt_regex ]]; then
				contexts+=('default')
			fi
		done
		unset IFS
		if [[ "${contexts:-}" ]]; then
			trim "$(printf "%q " "${contexts[@]}")"
		fi
	fi
}

# Echo all context names, sorted and distinct, from the git config or .gitattributes
get_contexts() {
	combined_contexts="$CONFIGURED_CONTEXTS $GITATTRIBUTES_CONTEXTS"
	sorted_contexts=$(echo "$combined_contexts" | tr ' ' '\n' | sort -u | tr '\n' ' ')
	if [[ "${sorted_contexts:-}" ]]; then
		trim "$sorted_contexts"
	fi
}

# Echo the number of items in a space-delimited list given as $1
count_items_in_list() {
	local trimmed
	trimmed=$(trim "$1")
	if [[ ! "$trimmed" ]]; then
		return 0
	fi
	local just_spaces="${trimmed//[^ ]/}"
	echo $((${#just_spaces} + 1))
}

# Utility function returns a truthy value if value $1 is in bash list or array $2
# Based on https://stackoverflow.com/a/8574392/4970
is_item_in_array() {
	local e match="$1"
	shift
	for e; do [[ "$e" == "$match" ]] && return 0; done
	return 1
}

# Trim leading and trailing whitespace from $1
# From https://stackoverflow.com/a/3352015/4970
trim() {
	local var="$*"
	# remove leading whitespace characters
	var="${var#"${var%%[![:space:]]*}"}"
	# remove trailing whitespace characters
	var="${var%"${var##*[![:space:]]}"}"
	printf '%s' "$var"
}

list_contexts() {
	for context in $(get_contexts); do
		# shellcheck disable=SC2086
		if ! is_item_in_array "$context" ${CONFIGURED_CONTEXTS}; then
			echo "$context (not initialised)"
		elif ! is_item_in_array "$context" ${GITATTRIBUTES_CONTEXTS}; then
			echo "$context (no patterns in .gitattributes)"
		else
			echo "$context"
		fi
	done
}

# print this script's usage message to stderr
usage() {
	cat <<-EOF >&2
		usage: transcrypt [-c CIPHER] [-p PASSWORD] [-h]
	EOF
}

# print this script's help message to stdout
help() {
	cat <<-EOF
		NAME
		     transcrypt -- transparently encrypt files within a git repository

		SYNOPSIS
		     transcrypt [options...]

		DESCRIPTION

		     transcrypt  will  configure a Git repository to support the transparent
		     encryption/decryption of files by utilizing OpenSSL's symmetric  cipher
		     routines  and  Git's  built-in clean/smudge filters. It will also add a
		     Git alias "ls-crypt" to list all transparently encrypted  files  within
		     the repository.

		     The  transcrypt  source  code  and full documentation may be downloaded
		     from https://github.com/elasticdog/transcrypt.

		OPTIONS
		     -c, --cipher=CIPHER
		            the symmetric cipher to utilize for encryption;
		            defaults to aes-256-cbc

		     -p, --password=PASSWORD
		            the password to derive the key from;
		            defaults to 30 random base64 characters

		     --set-openssl-path=PATH_TO_OPENSSL
		            use OpenSSL at this path; defaults to 'openssl' in \$PATH

		     -y, --yes
		            assume yes and accept defaults for non-specified options

		     -d, --display
		            display the current repository's cipher and password

		     -r, --rekey
		            re-encrypt all encrypted files using new credentials

		     -f, --flush-credentials
		            remove the locally cached encryption credentials and  re-encrypt
		            any files that had been previously decrypted

		     -F, --force
		            ignore whether the git directory is clean, proceed with the
		            possibility that uncommitted changes are overwritten

		     -u, --uninstall
		            remove  all  transcrypt  configuration  from  the repository and
		            leave files in the current working copy decrypted

		     --upgrade
		            apply the  latest transcrypt scripts  in the  repository without
		            changing your configuration settings

		     -l, --list
		            list all of the transparently encrypted files in the repository,
		            relative to the top-level directory

		     -s, --show-raw=FILE
		            show  the  raw file as stored in the git commit object; use this
		            to check if files are encrypted as expected

		     -e, --export-gpg=RECIPIENT
		            export  the  repository's cipher and password to a file encrypted
		            for a gpg recipient

		     -i, --import-gpg=FILE
		            import the password and cipher from a gpg encrypted file

		     -C, --context=CONTEXT_NAME
		            name for a context  with a different passphrase  and cipher from
		            the  'default' context;   use this  advanced option  to  encrypt
		            different files with different passphrases

		     --list-contexts
		            list all contexts configured in the  repository,  and warn about
		            incompletely configured contexts

		     -v, --version
		            print the version information

		     -h, --help
		            view this help message

		EXAMPLES

		     To initialize a Git repository to support transparent encryption,  just
		     change  into  the  repo  and run the transcrypt script. transcrypt will
		     prompt you interactively for all required  information  if  the  corre-
		     sponding option flags were not given.

		         $ cd <path-to-your-repo>/
		         $ transcrypt

		     Once  a  repository has been configured with transcrypt, you can trans-
		     parently encrypt files by applying the "crypt" filter,  diff and  merge
		     to a pattern in the  top-level .gitattributes config.  If that  pattern
		     matches  a file in your  repository,  the file  will  be  transparently
		     encrypted once you stage and commit it:

		         $ echo >> .gitattributes \\
		         'sensitive_file  filter=crypt diff=crypt merge=crypt'

		         $ git add .gitattributes sensitive_file
		         $ git commit -m 'Add encrypted version of a sensitive file'

		     See the gitattributes(5) man page for more information.

		     If  you  have  just  cloned  a  repository  containing  files  that are
		     encrypted, you'll want to configure transcrypt with the same cipher and
		     password  as  the  origin  repository.  Once  transcrypt has stored the
		     matching  credentials,  it  will  force  a  checkout  of  any  existing
		     encrypted files in order to decrypt them.

		     If  the  origin  repository  has  just rekeyed, all clones should flush
		     their transcrypt credentials, fetch and merge the new  encrypted  files
		     via Git, and then re-configure transcrypt with the new credentials.

		ADVANCED

		     Context names let you encrypt some files with different passwords for a
		     different audience, such as super-users. The 'default'  context applies
		     unless you set a context name.

		     Add a context by reinitialising transcrypt with a context name then add
			 a pattern with crypt-<CONTEXT_NAME> attributes to .gitattributes.
		     For example, to encrypt a file 'top-secret' in a "super" context:

		         # Initialise a new "super" context, and set a different password
		         $ transcrypt --context=super

		         # Add a pattern to .gitattributes with "crypt-super" values
		         $ echo >> .gitattributes \\
		           'top-secret filter=crypt-super diff=crypt-super merge=crypt-super'

		         # Add and commit your top-secret and .gitattribute files
		         $ git add .gitattributes top-secret
		         $ git commit -m "Add top secret file for super-users only"

		         # List all contexts
		         $ transcrypt --list-contexts

		         # Display the cipher and password for the "super" context
		         $ transcrypt --context=super --display

		AUTHOR
		     Aaron Bull Schaefer <aaron@elasticdog.com>

		SEE ALSO
		     enc(1), gitattributes(5)
	EOF
}

##### MAIN

# reset all variables that might be set
context=''
cipher=''
display_config=''
list_contexts_command=''
flush_creds=''
gpg_import_file=''
gpg_recipient=''
interactive='true'
list=''
password=''
rekey=''
show_file=''
uninstall=''
upgrade=''
openssl_path='openssl'

# used to bypass certain safety checks
requires_existing_config=''
requires_clean_repo='true'

# parse command line options
while [[ "${1:-}" != '' ]]; do
	case $1 in
	clean)
		shift
		git_clean "$@"
		exit $?
		;;
	smudge)
		shift
		git_smudge "$@"
		exit $?
		;;
	textconv)
		shift
		git_textconv "$@"
		exit $?
		;;
	merge)
		shift
		git_merge "$@"
		exit $?
		;;
	pre_commit)
		shift
		git_pre_commit "$@"
		exit $?
		;;
	-c | --cipher)
		cipher=$2
		shift
		;;
	--cipher=*)
		cipher=${1#*=}
		;;
	-p | --password)
		password=$2
		[[ $password ]] || die 1 'empty password'
		shift
		;;
	--password=*)
		password=${1#*=}
		[[ $password ]] || die 1 'empty password'
		;;
	-C | --context)
		context=$2
		shift
		;;
	--context=*)
		context=${1#*=}
		;;
	--set-openssl-path=*)
		openssl_path=${1#*=}
		# Immediately apply config setting
		git config transcrypt.openssl-path "$openssl_path"
		;;
	-y | --yes)
		interactive=''
		;;
	-d | --display)
		display_config='true'
		requires_existing_config='true'
		requires_clean_repo=''
		;;
	-r | --rekey)
		rekey='true'
		requires_existing_config='true'
		;;
	-f | --flush-credentials)
		flush_creds='true'
		requires_existing_config='true'
		;;
	-F | --force)
		requires_clean_repo=''
		;;
	-u | --uninstall)
		uninstall='true'
		requires_existing_config='true'
		requires_clean_repo=''
		;;
	--upgrade)
		upgrade='true'
		requires_existing_config='true'
		requires_clean_repo=''
		;;
	-l | --list)
		list='true'
		requires_clean_repo=''
		;;
	--list-contexts)
		list_contexts_command='true'
		requires_clean_repo=''
		;;
	-s | --show-raw)
		show_file=$2
		show_raw_file
		exit 0
		;;
	--show-raw=*)
		show_file=${1#*=}
		show_raw_file
		exit 0
		;;
	-e | --export-gpg)
		gpg_recipient=$2
		requires_existing_config='true'
		requires_clean_repo=''
		shift
		;;
	--export-gpg=*)
		gpg_recipient=${1#*=}
		requires_existing_config='true'
		requires_clean_repo=''
		;;
	-i | --import-gpg)
		gpg_import_file=$2
		shift
		;;
	--import-gpg=*)
		gpg_import_file=${1#*=}
		;;
	-v | --version)
		printf 'transcrypt %s\n' "$VERSION"
		exit 0
		;;
	-h | --help | -\?)
		help
		exit 0
		;;
	--*)
		warn 'unknown option -- %s' "${1#--}"
		usage
		exit 1
		;;
	*)
		warn 'unknown option -- %s' "${1#-}"
		usage
		exit 1
		;;
	esac
	shift
done

# Multi-context support, triggered by optional --context / -C command line option
set_context_globals() {
	if [[ "$context" ]] && [[ ! "$context" = 'default' ]]; then
		CONTEXT="$context"
		CONTEXT_CONFIG_GROUP=".${CONTEXT}" # Note leading period
		CONTEXT_CRYPT_SUFFIX="-${CONTEXT}" # Note leading dash
		CONTEXT_DESCRIPTION=" for context '$CONTEXT'"
	else
		CONTEXT='default'
		# Empty values for default/unset context
		CONTEXT_CONFIG_GROUP=""
		CONTEXT_CRYPT_SUFFIX=""
		CONTEXT_DESCRIPTION=""
	fi
}
set_context_globals

gather_repo_metadata

# always run our safety checks
run_safety_checks

# regular expression used to test user input
readonly YES_REGEX='^[Yy]$'

# in order to keep behavior consistent no matter what order the options were
# specified in, we must run these here rather than in the case statement above
if [[ $list ]]; then
	list_files
	exit 0
elif [[ $uninstall ]]; then
	uninstall_transcrypt
	exit 0
elif [[ $upgrade ]]; then
	upgrade_transcrypt
	exit 0
elif [[ $display_config ]] && [[ $flush_creds ]]; then
	display_configuration
	printf '\n'
	flush_credentials
	exit 0
elif [[ $display_config ]]; then
	display_configuration
	exit 0
elif [[ $list_contexts_command ]]; then
	list_contexts
	exit 0
elif [[ $flush_creds ]]; then
	flush_credentials
	exit 0
elif [[ $gpg_recipient ]]; then
	export_gpg
	exit 0
elif [[ $gpg_import_file ]]; then
	import_gpg
elif [[ $cipher ]]; then
	validate_cipher
fi

# perform function calls to configure transcrypt
get_cipher
get_password

if [[ $rekey ]] && [[ $interactive ]]; then
	confirm_rekey
elif [[ $interactive ]]; then
	confirm_configuration
fi

save_configuration

if [[ $rekey ]]; then
	stage_rekeyed_files
else
	force_checkout
fi

# ensure the git attributes file exists
if [[ ! -f $GIT_ATTRIBUTES ]]; then
	mkdir -p "${GIT_ATTRIBUTES%/*}"
	printf '#pattern  filter=crypt diff=crypt merge=crypt\n' >"$GIT_ATTRIBUTES"
fi

printf 'The repository has been successfully configured by transcrypt%s.\n' "$CONTEXT_DESCRIPTION"

exit 0
