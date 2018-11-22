import socket
from time import sleep

TCP_IP = '193.50.110.235'
TCP_PORT = 12343
BUFFER_SIZE = 1024
MESSAGE = "Hello! Socket. Hope you are doing great."

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((TCP_IP, TCP_PORT))
connected = True
print("connected to server")

while True:
    try:
        s.send(MESSAGE.encode('ascii'))
        data = s.recv(BUFFER_SIZE)
        str = data.decode('ascii')
        print("received data: " + str)
        if str == "quit":
            s.close()
            break
    except:
        pass


"""
    except socket.error:
        connected = False
        s = socket.socket()
        print("connection lost ... reconnecting..")
        while not connected:
            try:
                s.connect((TCP_IP, TCP_PORT))
                connected = True
                print("re-connection successful...")
            except socket.error:
                sleep(2)
                
"""





