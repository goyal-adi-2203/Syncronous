import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

app.use(
	cors({
		origin: [process.env.ORIGIN],
		mSethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));


app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});

setupSocket(server);

mongoose
	.connect(databaseUrl)
	.then(() => {
		console.log("DB connection successfull");
	})
	.catch((err) => {
		console.log(err.message);
	});
