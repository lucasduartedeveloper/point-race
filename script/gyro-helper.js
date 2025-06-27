var gyro = {
    accX: 0,
    accY: 0,
    accZ: 0
};

var gyroUpdated = function(gyro) { 
};

var onDeviceMotion = function(e) {
    gyro.accX = e.accelerationIncludingGravity.x;
    gyro.accY = e.accelerationIncludingGravity.y;
    gyro.accZ = e.accelerationIncludingGravity.z;

    gyroUpdated(gyro);
};

var startDeviceMotion = function() {
    window
        .addEventListener("devicemotion",
        onDeviceMotion);
};