var assert = require("assert");
const {
  jsonStringifyNoQuotes,
  buildActionURL,
  extractLtikFromReq,
  populateForm,
  generateFormHTML,
} = require("../src/utils/deeplink-get-functions");
const dlx = require("../src/dlx-dictionary");

describe("deeplink-get-functions.js", function () {
  describe("Unit Tests", function () {
    describe("buildActionURL", function () {
      it("It should return an action URL that is the parameter + /deeplink.", function () {
        assert.equal(
          buildActionURL("https://www.serverurl.com"),
          "https://www.serverurl.com/deeplink"
        );
      });
    });
    describe("extractLtikFromReq", function () {
      it("When given /deeplink?ltik=<key> it should return <key>.", function () {
        assert.equal(extractLtikFromReq("/deeplink?ltik=<key>"), "<key>");
      });
    });
    describe("jsonStringifyNoQuotes", function () {
      it('It should return a json string with &quot instead of ".', function () {
        assert.equal(
          jsonStringifyNoQuotes({
            type: "ltiResourceLink",
            title: "My Test",
            url: process.env.URL + "/launchtesting",
          }),
          "{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;My Test&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/launchtesting&quot;}"
        );
      });
    });
    describe("populateForm", function () {
      it("It should return an HTML form with the variables populated using the parameters.", function () {
        assert.equal(
          populateForm(
            "actionURL",
            "ltik",
            "launchtesting",
            "apitesting",
            "reactmultiplayerapp",
            "mpcl1",
            "mpcl2",
            "rab"
          ),
          `
<form
  action="actionURL"
  method="post"
>
  <input type="hidden" name="ltik" value="ltik" />
  <input type="checkbox" id="launchtest" name="dlx" value="launchtesting" />
  <label for="launchtest">launch_test</label>
  <br />
  <input type="checkbox" id="apitest" name="dlx" value="apitesting" />
  <label for="apitest">api_test</label>
  <br />
  <input type="checkbox" id="reactmultiplayerapp" name="dlx" value="reactmultiplayerapp" />
  <label for="reactmultiplayerapp">react multiplayer app</label>
  <br />
  <input type="checkbox" id="mpcl1" name="dlx" value="mpcl1" />
  <label for="mpcl1">mpcl1</label>
  <br />
  <input type="checkbox" id="mpcl2" name="dlx" value="mpcl2" />
  <label for="mpcl2">mpcl2</label>
  <br />
  <input type="checkbox" id="rab" name="dlx" value="rab" />
  <label for="rab">rab</label>
  <input type="submit" value="Submit" />
</form>`
        );
      });
    });
  });
  describe("Integration Tests", function () {
    it("generateFormHTML", function () {
      assert.equal(
        generateFormHTML({ originalUrl: "/deeplink?ltik=<key>" }),
        `
<form
  action="https://loosely-funny-stag.ngrok-free.app/deeplink"
  method="post"
>
  <input type="hidden" name="ltik" value="<key>" />
  <input type="checkbox" id="launchtest" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;My Test&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/launchtesting&quot;}" />
  <label for="launchtest">launch_test</label>
  <br />
  <input type="checkbox" id="apitest" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;API Test&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/apitesting&quot;}" />
  <label for="apitest">api_test</label>
  <br />
  <input type="checkbox" id="reactmultiplayerapp" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;React Multiplayer App&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/reactmultiplayerapp&quot;}" />
  <label for="reactmultiplayerapp">react multiplayer app</label>
  <br />
  <input type="checkbox" id="mpcl1" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;MP Circuits Lab 1&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/mpcl1&quot;}" />
  <label for="mpcl1">mpcl1</label>
  <br />
  <input type="checkbox" id="mpcl2" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;MP Circuits Lab 2&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/mpcl2&quot;}" />
  <label for="mpcl2">mpcl2</label>
  <br />
  <input type="checkbox" id="rab" name="dlx" value="{&quot;type&quot;:&quot;ltiResourceLink&quot;,&quot;title&quot;:&quot;Roll-a-ball&quot;,&quot;url&quot;:&quot;https://loosely-funny-stag.ngrok-free.app/rab&quot;}" />
  <label for="rab">rab</label>
  <input type="submit" value="Submit" />
</form>`
      );
    });
  });
});

// describe("generateFormHTML Function", function () {
//   it("should return a proper HTML form using the dlx dictionary and lti key", function () {
//     assert.equal(
//       generateFormHTML({
//         originalUrl: "test",
//       }),
//       <form action="${actionURL}" method="post">
//         <input type="hidden" name="ltik" value="${ltik}" />
//         <input
//           type="checkbox"
//           id="launchtest"
//           name="dlx"
//           value="${launchtesting}"
//         />
//         <label for="launchtest">launch_test</label>
//         <br />
//         <input type="checkbox" id="apitest" name="dlx" value="${apitesting}" />
//         <label for="apitest">api_test</label>
//         <br />
//         <input
//           type="checkbox"
//           id="reactmultiplayerapp"
//           name="dlx"
//           value="${reactmultiplayerapp}"
//         />
//         <label for="reactmultiplayerapp">react multiplayer app</label>
//         <br />
//         <input type="checkbox" id="mpcl1" name="dlx" value="${mpcl1}" />
//         <label for="mpcl1">mpcl1</label>
//         <br />
//         <input type="checkbox" id="mpcl2" name="dlx" value="${mpcl2}" />
//         <label for="mpcl2">mpcl2</label>
//         <br />
//         <input type="checkbox" id="rab" name="dlx" value="${rab}" />
//         <label for="rab">rab</label>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   });
// });
