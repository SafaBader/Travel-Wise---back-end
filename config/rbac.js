import { AccessControl } from "accesscontrol";

const ac = new AccessControl();

// Define roles and permissions
ac.grant("user") // User role
  .createOwn("plan") // Can create own plans
  .readOwn("plan")
  .updateOwn("plan")
  .deleteOwn("plan")
  .createOwn("review") // Can create own reviews
  .readOwn("review")
  .updateOwn("review")
  .deleteOwn("review")
  .createOwn("favourite") // Can manage own favourites
  .readOwn("favourite")
  .deleteOwn("favourite");

ac.grant("admin") // Admin role
  .createAny("place") // Full CRUD on places
  .readAny("place")
  .updateAny("place")
  .deleteAny("place")
  .createAny("review") // Full CRUD on reviews
  .readAny("review")
  .updateAny("review")
  .deleteAny("review")
  .createAny("plan") // Full CRUD on plans
  .readAny("plan")
  .updateAny("plan")
  .deleteAny("plan")
  .createAny("favourite") // Full CRUD on favourites
  .readAny("favourite")
  .deleteAny("favourite")
  .createAny("user") // Manage users
  .readAny("user")
  .updateAny("user")
  .deleteAny("user");

export default ac;
