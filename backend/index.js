import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import searchRouter from "./routes/search.routes.js";
import indexRoutes from "./routes/index.routes.js";
import uploadRoutes from "./routes/uploades.routes.js";
import indexConfigRoutes from "./routes/indexConfig.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/indexes", indexRoutes);
app.use("/api/indexes", uploadRoutes);
app.use("/api/search", searchRouter);
app.use("/api/indexes", indexConfigRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});