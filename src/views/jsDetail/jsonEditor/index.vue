<template>
  <div>
    <div id="jsoneditor" style="width: 400px; height: 400px;"></div>
    <p>
      <button @click="setJSON">Set JSON</button>
      <button @click="getJSON">Get JSON</button>
    </p>
  </div>
</template>

<script>
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";
// import "jsoneditor/dist/jsoneditor.min.css";
// import "jsoneditor/dist/jsoneditor.min.js";
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    var container = document.getElementById("jsoneditor");
    var options = {
      mode: "tree"
    };
    this.editor = new JSONEditor(container, options);
    var json = {
      Array: [1, 2, 3],
      Boolean: true,
      Null: null,
      Number: 123,
      Object: { a: "b", c: "d" },
      String: "Hello World"
    };
    this.editor.set(json);
  },
  methods: {
    setJSON() {
      var json = {
        Object: { a: "b", c: "d" },
        String: "Hello World"
      };
      this.editor.set(json);
    },
    getJSON() {
      var json = this.editor.get();
      alert(JSON.stringify(json, null, 2));
    }
  }
};
</script>

<style lang="scss" scoped></style>
