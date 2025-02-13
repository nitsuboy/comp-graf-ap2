export class Projectile {
    constructor(position, velocity) {
        this.position = position; // Vector3 for position
        this.velocity = velocity; // Vector3 for velocity
        this.alive = true; // To check if the projectile is still active
    }

    update(deltaTime) {
        if (this.alive) {
            // Update position based on velocity and time
            this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        }
    }

    checkCollision(target) {
        // Simple AABB collision detection
        const distance = this.position.distanceTo(target.position);
        return distance < target.size; // Assuming target has a size property
    }

    destroy() {
        this.alive = false; // Mark the projectile as inactive
    }
}

export default Projectile;