import serial
import time

class ArduinoController:
    def __init__(self, port='COM3', baud=9600):
        """Initialize the serial connection."""
        self.port = port
        self.baud = baud
        try:
            self.arduino = serial.Serial(port, baud, timeout=1)
            time.sleep(2)  # wait for Arduino to reset
            print(f"Connected to Arduino on {port}")
        except serial.SerialException as e:
            print(f"Error connecting to Arduino: {e}")
            self.arduino = None

    def turn_on(self):
        """Turn the Arduino system ON."""
        if self.arduino:
            print("Arduino ON")
            self.arduino.write(b'1')

    def turn_off(self):
        """Turn the Arduino system OFF."""
        if self.arduino:
            print("Arduino OFF")
            self.arduino.write(b'0')

    def close(self):
        """Close the serial connection."""
        if self.arduino:
            self.arduino.close()
            print("Arduino serial connection closed")