import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { extendedApiSlice } from "./features/posts/postsSlice";
import { fetchPosts } from "./features/posts/postsSlice";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// fetching on initial render
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchPosts());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
