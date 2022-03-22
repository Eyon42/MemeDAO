// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

import {LensHub} from '../core/LensHub.sol';

/**
 * @title PublishingLogic
 * @author Lens Protocol
 *
 * @notice This is the library that contains the logic for profile creation & publication.
 *
 * @dev The functions are external, so they are called from the hub via `delegateCall` under the hood. Furthermore,
 * expected events are emitted from this library instead of from the hub to alleviate code size concerns.
 */
library PublishingLogic {

}
