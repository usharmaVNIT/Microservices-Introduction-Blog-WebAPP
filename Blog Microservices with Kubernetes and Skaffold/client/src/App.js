import logo from "./logo.svg";
// import "./App.css";
import PostCreate from "./PostCreate";
import PostList from "./PostList";
function App() {
  return (
    <>
      <h1>Post Create</h1>
      <PostCreate />
      <h2> Post List</h2>
      <PostList />
    </>
  );
}

export default App;
