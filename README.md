# Socket Programming- Communication with Client Server Sending UDP Packets
University Of Prishtina - Faculty of Electrical and Computer Engineering/Department of Computer and Software Engineering

## Supervisor
Second Project in Computer Network Course supervised by Dr.Sc. Mërgim H. Hoti

## Description
This project is a secure client-server application built using Node.js. It enables a client to send encrypted commands to a server over UDP to perform various file system operations. The primary purpose of the project is to remotely manage and manipulate files and directories on the server through specific commands.

The client provides a simple web interface for users to submit commands and messages, which are securely encrypted before being sent to the server. The server decrypts the commands, matches them against predefined patterns (using regular expressions), and executes the corresponding operations. These operations include creating, reading, renaming, deleting files or folders, and even writing to or opening files.

In summary, the project demonstrates secure communication between a client and a server, enabling remote file system management via encrypted UDP messages.

## Technologies Used
- Node.js: Provides the runtime and libraries for creating the client and server.
- UDP (User Datagram Protocol): A lightweight, connectionless protocol for communication between the client and server.
- Express.js: Used to handle HTTP endpoints for client-side interaction.
- AES Encryption: Encrypts messages sent over UDP to ensure security.
- dotenv: Manages environment variables (e.g., IP_ADDRESS, PORT).
- fs:Allows file system operations like creating, reading, deleting, renaming files/folders.
- open: Opens files using the default application on the host system.

## Components

### Client
The client in this project is a Node.js application that interacts with a web interface and communicates with the server over UDP. Its main role is to send commands to the server for various file system operations. Let's break it down:
- Web Interface (Express): It provides a simple web interface (using Express.js) for users to submit commands. Users can input file system operations they wish to perform on the server.
- UDP Client: The client then takes these commands, encrypts them using AES encryption, and sends them as UDP packets to the server.

### Server
The server is also a Node.js application that listens for UDP messages sent by the client. Once it receives a message, the server:

- Decryption: It decrypts the message using AES encryption to reveal the original command.
- Command Processing: The server matches the command to predefined operations (such as creating, reading, or deleting files/folders).
- File System Operations: The server performs the requested operation (e.g., create a folder, read a file) on the file system.
- Response: The server then sends a response (e.g., success or failure message, list of files) back to the client over UDP.

### Encryption Decryption (AES)
For secure communication, both the client and server use AES encryption to encrypt and decrypt the data being transmitted.

- Client-Side Encryption: Before sending any data to the server, the client encrypts the message using AES to ensure that it cannot be easily intercepted or tampered with.
- Server-Side Decryption: The server decrypts the incoming messages using the same encryption algorithm to retrieve the original command.
The encryption ensures that the communication between the client and server is secure, protecting sensitive data (e.g., file names, contents) from being exposed in plain text during transmission.


### Commands That You Can Run

| Command               | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
| /createFolder <name> | Creates a new folder with the specified name.                       |
| /readFolder <name>   | Lists the contents of the specified folder.                        |
| /removeFolder <name> | Deletes the specified folder (if it exists).                        |
| /createFile <name>   | Creates a new file with the specified name.                         |
| /openFile <name>     | Opens the specified file using the default application on the host system. |
| /readFile <name>     | Reads the contents of the specified file and sends the data back to the client. |
| /writeFile <file> <text> | Appends the specified text to the file.                         |
| /renameFile <old> <new> | Renames a file from old to new.                                  |



## Installation

### 1. Install Node.js

Ensure that Node.js is installed on your system. You can download and install it from the official website:

[Download Node.js](https://nodejs.org/)

Once installed, you can verify it by checking the version in your terminal:

node -v

### 2. Clone the Repository
Clone this repository to your local machine using Git:


git clone https://github.com/AlbinArifaj/Grupi4_SocketProgramming
cd Grupi4_SocketProgramming

### 3. Install Dependencies
Navigate to the project directory and install the necessary dependencies using npm:

npm install
### 4. Set Up Environment Variables
Create a .env file in the root of the project directory, and add the following lines:

IP_ADDRESS=your-server-ip-address
PORT=your-port-number
ALGORITHM=aes-256-ctr
SECRET_KEY=your-secret-key
Make sure to replace your-server-ip-address with the IP address of your server, your-port-number with the port number you wish to use adn your-secret-key the key you want to use for encryption and decryption.

### 5. Run the Server and Client
To start the application:

Run the server:
node server.js
In a separate terminal, run the client:

node client.js
## Authors

- [@Albin Arifaj](https://github.com/AlbinArifaj)
- [@Albion Ahmeti](https://github.com/AlbionAhmeti)
- [@Alfred Palokaj](https://github.com/AlfredPalokaj)
