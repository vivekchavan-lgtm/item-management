// require("dotenv").config();
// const bcrypt = require("bcryptjs");
// const pool = require("./src/config/db");

// async function testRegister() {
//   try {
//     const password = await bcrypt.hash("Test@123", 10);
//     const res = await pool.query(
//       `INSERT INTO users (name,email,password,address,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
//       ["Test Name For Validation Over 20 Chars", `test_${Date.now()}@test.com`, password, "Test Address", "USER"]
//     );
//     console.log("Success:", res.rows[0]);
//   } catch (err) {
//     console.error("DB Error:", err.message);
//   } finally {
//     pool.end();
//   }
// }
// // 
// testRegister();
