
export function adjustVelocity(dm, pdm, particles, key, xFlag) {

    // case: we're moving in the positive direction
    if (pdm > 0) {

        // we intialize our velocity to one unit
        dm = window.particleSize;

        // we're comparing our velocity with the potential velocity
        while (dm <= pdm) {

            // the key changes if we're move in x or y, so this fixes that
            var keymod = (xFlag) ? 1000 * dm : dm;

            // if we encounter something where we're attempting to move
            // we lower our real velocity and break
            if (particles.has(key + keymod)) {
                dm -= window.particleSize;
                break;

            // if there's nothing there, we increase our real velocity
            // and check the next spot
            } else {
                dm += window.particleSize;
            }
        }

        // this fixes the case where a particle wants to move too far
        if (dm > pdm) dm -= window.particleSize;

    // case: we're moving in the negative direction
    } else if (pdm < 0) {

        // we intialize our velocity to one unit negative
        dm = -1 * window.particleSize;

        // we're comparing our velocity to our potential velocity
        while (dm >= pdm) {

            // the key changes if we're move in x or y, so this fixes that
            var keymod = (xFlag) ? 1000 * dm : dm;

            // if we encounter something where we're attempting to move
            // we lower our real velocity and break
            if (particles.has(key + keymod)) {
                dm += window.particleSize;
                break;

            // if there's nothing there, we increase our real velocity
            // and check the next spot
            } else {
                dm -= window.particleSize;
            }
        }

        // this fixes the case where a particle wants to move too far
        if (dm <= pdm) dm += window.particleSize;
    }
    return dm;
}