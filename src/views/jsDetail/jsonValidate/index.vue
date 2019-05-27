<template>
  <div class="jsonValidate">
    <textarea placeholder="请输入内容" v-model="holyTextarea" />

    <div>
      {{ JSON.stringify(holyData, null, 2) }}
    </div>
    <div>
      {{ JSON.stringify(holyData) }}
    </div>
    <div>
      {{ validata }}
    </div>
  </div>
</template>

<script>
// import Ajv from "ajv";
var Ajv = require("ajv");
const holyData = {
  name: "Holybasil",
  gender: "famale",
  partner: {
    name: "Jackson",
    gender: "aale",
    hobby: "dancing"
  },
  phone: 17600141287
};
export default {
  data() {
    return {
      holyData,
      holyTextarea: JSON.stringify(holyData, null, 2),
      holyDiv: JSON.stringify(holyData),
      validata: false
    };
  },
  created() {
    // console.log(this.holyTextarea, this.holyDiv, "美化后的JSON string");
    var ajv = new Ajv();
    var schema = {
      properties: {
        name: {
          type: "number"
        }
      },
      patternProperties: {
        "^gen.*$": { enum: ["male", "famale"] }
      }
    };
    var validate = ajv.compile(schema);
    this.validata = validate(holyData);
    if (this.validata) console.log("Valid!");
    else console.log("Invalid: " + ajv.errorsText(validate.errors));
  }
};
</script>

<style lang="scss" scoped>
.jsonValidate {
  display: flex;
  height: 300px;
  & > * {
    height: 100%;
    flex: 1;
  }
}
</style>
