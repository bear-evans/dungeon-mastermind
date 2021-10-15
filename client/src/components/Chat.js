import React,{useState} from 'react'
import Axios  from 'axios'
import io from "socket.io-client"
import {
    Drawer,
    DrawerFooter,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Textarea,
    FormControl,
    Box
  } from "@chakra-ui/react"
  import ContactList from './ContactList'
import Messages from './messages'

function Chat() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const [user,setUser]=useState("")
    const [newMessage,setNewMessage] = useState("")

  
    const getUser = () => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: "/auth/user",
      }).then((res) => {
        setUser(res.data);
        console.log ('is it working')
      });
    };

    function runfunctions(){
        onOpen();
        getUser();

    }
    //SOCKETio

    useEffect(() => {
      socketRef.current = io.connect('/');
  
      socketRef.current.on("your id", id => {
        setYourID(id);
      })
  
      socketRef.current.on("message", (message) => {
        console.log("here");
        receivedMessage(message);
      })
    }, []);
    
    function receivedMessage(message) {
      setMessages(oldMsgs => [...oldMsgs, message]);
    }

    const submitMessage = event => {
      event.preventDefault()
      const messageObject = {
        body: message,
        id: yourID,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }

    return (
        <>
        <Button ref={btnRef} colorScheme="teal" onClick={runfunctions}>
          Chat
        </Button>
        
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <Tabs>
  <TabList>
    <Tab>Chats</Tab>
    <Tab>Messages</Tab>
  </TabList>
  

  <TabPanels>
    <TabPanel>
      <ContactList currentUser = {user} />
    </TabPanel>
    <TabPanel>
        <Box overflowY="auto"
        height = "60vh"
          >
        <Messages/>
        <Messages/>
        <Messages/>
        <Messages/>
        <Messages/>
        </Box>
        <form onSubmit = {submitMessage}>
        <FormControl>
        <Textarea
        onChange={(e) => setNewMessage(e.target.value)}
        value = {newMessage}
        />
        </FormControl>
        <Button type='submit'>Send</Button>
        </form>
    </TabPanel>
  </TabPanels>
</Tabs>
            <DrawerFooter>
              <Button variant="outline" mr={2} onClick={onClose}>
               Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}

export default Chat
