// const express = require("express");
// const cors = require("cors");

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const storeRoutes =require("./routes/storeRoutes");
// const verifyToken = require("./models/authMiddleware");
// const authorize = require("./middleware/roleMiddleware");
// const ratingRoutes =require("./routes/ratingRoutes");
// const ownerRoutes =require("./routes/ownerRoutes");


// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/stores", storeRoutes);
// app.use("/api/ratings", ratingRoutes);
// app.use("/api/owner", ownerRoutes);

// app.get(
//   "/api/test",
//   verifyToken,
//   (req, res) => {
//     res.json(req.user);
//   }
// );

// app.get(
//   "/api/admin-test",
//   verifyToken,
//   authorize("ADMIN"),
//   (req, res) => {
//     res.json({
//       message: "Welcome Admin"
//     });
//   }
// );


// module.exports = app;