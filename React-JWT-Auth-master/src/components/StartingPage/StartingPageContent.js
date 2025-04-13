import { useContext } from "react";
import classes from "./StartingPageContent.module.css";
import AuthContext from "../../store/auth-context";

const StartingPageContent = () => {
  const authCtx = useContext(AuthContext);
  return (
    <div>
      {authCtx.isLoggedIn && (
        <section className={classes.starting}>
          <h1>Welcome on Board!</h1>
        </section>
      )}
      {!authCtx.isLoggedIn && (
        <section className={classes.starting}>
          <h1>Welcome to JWT Auth Space</h1>
        </section>
      )}
    </div>
  );
};

export default StartingPageContent;
