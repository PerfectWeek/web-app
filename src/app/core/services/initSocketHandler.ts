export const initSocketHandler = (token: string) => (socket: SocketIOClient.Socket) => {
    console.log("Socket Mamene !");

    socket.emit("authenticate", { token });

    socket.on("exception", (errorMessage: string) => {
        console.error(`Socket Error: ${errorMessage}`);
    });

    socket.on("friend_accepted", (data: any) => {
        const { title, description, payload } = data;

        console.log("================")
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Payload:", payload);
        console.log("================");
    });
};
