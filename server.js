const jsonServer = require("json-server");
const auth = require("json-server-auth");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(auth); // enable login/register/etc

// Custom /me/id route
server.get("/me/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Find the user based on id
  const user = router.db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Find the role based on user roleId
  const role = router.db.get("roles").find({ id: user.roleId }).value();
  if (!role) {
    return res.status(404).json({ error: "Role not found" });
  }

  // Find permissions based on roleId
  const permissions = role.permissions
    .map((permissionId) => {
      const permission = router.db
        .get("permissions")
        .find({ id: permissionId })
        .value();
      return permission ? permission.name : null;
    })
    .filter((permission) => permission !== null);

  // Construct the response object
  const response = {
    name: user.name,
    email: user.email,
    id: user.id,
    permissions: permissions,
  };

  res.json(response);
});

server.use(router);

server.listen(4201, () => {
  console.log("JSON Server is running on http://localhost:4201");
});
