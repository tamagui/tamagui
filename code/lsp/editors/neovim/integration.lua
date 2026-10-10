-- drives a REAL neovim against the server using exactly the config that
-- `tamagui-lsp setup neovim` printed. no stubs, no hand-rolled client.
local ok = true
local function check(name, pass, detail)
  print((pass and 'PASS  ' or 'FAIL  ') .. name .. (detail and ('  -> ' .. detail) or ''))
  if not pass then ok = false end
end

local target = vim.fn.getenv('PROBE_FILE')
vim.cmd('edit ' .. target)

-- wait for neovim to attach the server to this buffer
local buf = vim.api.nvim_get_current_buf()
local client = nil
vim.wait(20000, function()
  local clients = vim.lsp.get_clients({ bufnr = buf, name = 'tamagui' })
  client = clients[1]
  return client ~= nil and client.initialized
end, 100)

check('filetype detected as typescriptreact', vim.bo[buf].filetype == 'typescriptreact', vim.bo[buf].filetype)
check('neovim attached the tamagui server', client ~= nil, client and ('id ' .. client.id) or 'no client')

if not client then
  print('cannot continue without a client')
  vim.cmd('cquit 1')
end

-- neovim negotiated these, not us
local caps = client.server_capabilities
check('incremental sync negotiated', caps.textDocumentSync == 2 or (type(caps.textDocumentSync) == 'table' and caps.textDocumentSync.change == 2),
  vim.inspect(caps.textDocumentSync))
check('completion advertised', caps.completionProvider ~= nil)
check('color decorators advertised', caps.colorProvider ~= nil)
check('root resolved to the kitchen-sink project', (client.root_dir or ''):match('kitchen%-sink') ~= nil, client.root_dir)

-- put the cursor inside bg="" on line 2 and ask for completions through
-- neovim's own request path
local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)
local row, col
for i, line in ipairs(lines) do
  local s = line:find('bg="')
  if s then row, col = i - 1, s + 3 end
end
check('found the bg="" site in the buffer', row ~= nil, row and ('line ' .. row .. ' col ' .. col))

vim.api.nvim_win_set_cursor(0, { row + 1, col })

local items, done = nil, false
local params = vim.lsp.util.make_position_params(0, client.offset_encoding)
client:request('textDocument/completion', params, function(err, result)
  if not err and result then
    items = result.items or result
  end
  done = true
end, buf)
vim.wait(15000, function() return done end, 50)

check('completions returned', items ~= nil and #items > 0, items and ('#' .. #items) or 'none')
if items and #items > 0 then
  local labels = {}
  for i = 1, math.min(6, #items) do labels[#labels + 1] = items[i].label end
  print('       first items: ' .. table.concat(labels, ', '))
  -- prop-aware: bg is a colour prop, so the space scale must not be here
  local sawSpaceToken = false
  for _, item in ipairs(items) do
    if item.label == '-0-5' or item.label == '-10' then sawSpaceToken = true end
  end
  check('bg offers colours, not the negative space scale', not sawSpaceToken)
end

-- colour decorators through neovim
local colors, cdone = nil, false
client:request('textDocument/documentColor', { textDocument = vim.lsp.util.make_text_document_params(buf) }, function(err, result)
  if not err then colors = result end
  cdone = true
end, buf)
vim.wait(10000, function() return cdone end, 50)
check('document colours returned', colors ~= nil, colors and ('#' .. #colors) or 'none')

if ok then
  print('\nALL NEOVIM CHECKS PASSED')
  vim.cmd('qall!')
else
  vim.cmd('cquit 1')
end
