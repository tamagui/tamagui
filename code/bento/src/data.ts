import {
  listingData as animationListingData,
  paths as animationPaths,
} from './sections/animation/data'
import {
  listingData as cartListingData,
  paths as cartPaths,
} from './sections/ecommerce/data'
import {
  listingData as elementsListingData,
  paths as elementsPaths,
} from './sections/elements/data'
import {
  paths as formPaths,
  listingData as formsListingData,
} from './sections/forms/data'
import {
  listingData as shellsListingData,
  paths as shellsPaths,
} from './sections/shells/data'
import { listingData as userListingData, paths as userPaths } from './sections/user'

export const paths = [
  ...formPaths,
  ...elementsPaths,
  ...shellsPaths,
  ...animationPaths,
  ...cartPaths,
  // ...panelsPaths,
  ...userPaths,
]

export const listingData = {
  sections: [
    ...formsListingData,
    ...elementsListingData,
    ...shellsListingData,
    ...animationListingData,
    ...cartListingData,
    // ...panelsListingData,
    ...userListingData,
  ],
}

// kind of cheating exporting this just so bento landing page avoids importing all of bento
export { LocationNotification } from './components/user/preferences'
