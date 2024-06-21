var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/cml.js
var require_cml = __commonJS({
  "src/cml.js"(exports, module) {
    var styled = {};
    var errlist = {
      // For Params: %lol=haha=asd => split at each `=` => greater than 3? => error.
      eqspl3: new Error(`
You can't have more than 3 Equals characters (\`=\`)!
Try to shorten it please, use \`|e\`
it is the escaped version of \`=\`.

Use: "meta %name=viewport %content=width|edevice-width;"
  => \`|e\` replaced with \`=\`
  => "meta %name=viewport %content=width=device-width;"
`),
      scripterror: new Error(`
Apparently, you made an error loading or executing your script.
Look back and take a gander.

Potentially:
  => Check if you loaded the right file.
  => Check if you made a typo.
  => Check if you did not add the directory to the file.
  => Check if you did every thing else right.
  
  => If all else. cry :(
`)
    };
    Object.prototype.SJSON = function() {
      return JSON.stringify(this);
    };
    Object.prototype.toJSON = function() {
      const methods = {};
      for (const key in this) {
        if (typeof this[key] === "function") {
          methods[key] = this[key].toString();
        }
      }
      return {
        ...this,
        methods
      };
    };
    function unpackClassFromJSON(json) {
      const className = json.__className;
      const classMethods = json.methods;
      const classDefinition = new Function(`return ${classMethods.constructor}`)();
      const instance = new classDefinition();
      delete json.methods;
      delete json.__className;
      Object.assign(instance, json);
      for (const methodName in classMethods) {
        instance[methodName] = new Function(`return ${classMethods[methodName]}`)();
      }
      return instance;
    }
    var DOMerr = {
      noBeam: `
c;
  beam;
    "Beam Failed!
    <br>
    Try to fix the simple Fetch error.
    <br>
    Shouldn't take long.";
  `
    };
    var $ = (a2) => {
      return document.querySelector(a2);
    };
    var arrMatch = (str, arr) => {
      let count = 0;
      let list = [];
      for (let i = 0; i < arr.length; i++) {
        if (str.includes(arr[i])) {
          count++;
          list.push(arr[i]);
        }
      }
      return { count, list };
    };
    var CHUBparse = (a) => {
      class CSSRulesetManager {
        constructor(selector) {
          this.selector = selector;
          this.existingRules = {};
          this.styleSheet = document.styleSheets[0];
        }
        checkRulesetExists() {
          this.existingRules = this.styleSheet.cssRules || this.styleSheet.rules;
          for (let i = 0; i < this.existingRules.length; i++) {
            const rule = this.existingRules[i];
            if (rule.selectorText === this.selector) {
              return true;
            }
          }
          return false;
        }
        addRule(styles) {
          if (!this.checkRulesetExists()) {
            if (this.styleSheet.insertRule) {
              this.styleSheet.insertRule(`${this.selector} { ${styles} }`, this.existingRules.length);
            } else if (this.styleSheet.addRule) {
              this.styleSheet.addRule(this.selector, styles, this.existingRules.length);
            }
          }
        }
        toJSON() {
          return {
            selector: this.selector,
            styleSheetIndex: Array.from(document.styleSheets).indexOf(this.styleSheet)
          };
        }
        static fromJSON(json) {
          const { selector, styleSheetIndex } = json;
          const styleSheet = document.styleSheets[styleSheetIndex];
          return new CSSRulesetManager(selector, styleSheet);
        }
      }
      function unpackJSON(json) {
        const data = JSON.parse(json);
        if (typeof data === "object" && data !== null) {
          if (data.hasOwnProperty("prototype") && data.prototype.hasOwnProperty("fromJSON")) {
            return data.prototype.fromJSON(data);
          } else if (Array.isArray(data)) {
            return data.map((item) => unpackJSON(item));
          } else {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                data[key] = unpackJSON(data[key]);
              }
            }
            return data;
          }
        }
        return data;
      }
      var reg = {
        quoteExept: /\n(?=(?:(?:[^"]*"){2})*[^"]*$)/gm,
        colExept: /\n(?=(?:(?:[^:]*:){2})*[^:]*$)/gm,
        betweenQuote: /"([a-zA-Z\s\S]+)"/gm,
        betweenCol: /^:([a-zA-Z\S\s]+):/gm,
        script: /\{\=([a-zA-Z\S\s][^;]+)\=\}/gm,
        comment: /\/\/(.*)\n{0,1}/gm,
        lineWithComment: /[^a-zA-Z0-9:-■\n]+((?:[\t ]{0,})\/\/(?:.*)\n{0,1})/gm,
        formatspace1: /\n{1,}/gm,
        formatspace2: /\n[\t \n]{0,}\n/gm
      };
      a = a.replace(reg.lineWithComment, "").replace(reg.formatspace2, "\n").replace(reg.formatspace1, "\n");
      var splitn = a.split(/;/);
      var col = [];
      splitn.forEach((o, r) => {
        var indentn = o.search(/\S/);
        if (!col[r])
          col[r] = {};
        var trimmed = o.trim();
        col[r].c = trimmed;
        col[r].i = indentn;
      });
      var stringi = (contentObj, vor) => {
        let result = "";
        const indentString = "  ";
        let indexes = {
          str: 0,
          tmp: 0
        };
        var traverse = (obj, level, nv = "") => {
          var strBuild = obj.c;
          var isStr = strBuild.search(reg.betweenQuote);
          var hasOpts = strBuild.search(reg.betweenCol);
          var isscr = strBuild.match(reg.script);
          let def = {
            tag: "",
            id: "",
            class: "",
            content: "",
            data: "",
            attr: "",
            indent: 0
          };
          let tempC = {
            tag: "",
            id: "",
            class: "",
            content: "",
            data: "",
            attr: "",
            indent: 0
          };
          if (isscr !== null) {
            var scrmatch = reg.script.exec(obj.c);
            let issrc = scrmatch[1].includes("src=");
            let execafter = scrmatch[1].includes('"execafter";\n');
            var dostill = true;
            if (issrc && scrmatch) {
              let srcis = scrmatch[1].match(/src="(.*)"/)[1];
              fetch(srcis).then((js) => {
                return js.text();
              }).then((text) => {
                try {
                  let script = document.createElement("script");
                  script.type = "text/javascript";
                  script.text = text;
                  document.body.appendChild(script);
                } catch (error) {
                  console.log(error, errlist.scripterror);
                }
              });
              dostill = false;
            }
            if (scrmatch !== null && dostill) {
              try {
                eval(scrmatch[1]);
              } catch (error) {
                console.log(error, errlist.scripterror);
              }
            }
          }
          var checkAttr = (arr) => {
            arr.forEach((param, pind) => {
              switch (param[0]) {
                case "#":
                  tempC.id = `${tempC.id ? tempC.id + " " : ""}${param.replace("#", " ")}`;
                  break;
                case ".":
                  tempC.class = `${tempC.class ? tempC.class + " " : ""}${param.replace(".", " ")}`;
                  break;
                case "$":
                  let dataParam = attrSyn(param);
                  let dataB = `data-${dataParam[0].slice(1) + '="' + dataParam[1] + '"'}`;
                  tempC.data = `${tempC.data ? tempC.data + " " : ""}${dataB}`;
                  break;
                case "%":
                  let attrParam = attrSyn(param);
                  let attrB = `${attrParam[0].slice(1) + '="' + attrParam[1] + '"'}`;
                  tempC.attr = `${tempC.attr ? tempC.attr + " " : ""}${attrB}`;
                  break;
                case "@":
                  console.log("using @", `${param}`.slice(8), `${param}`.split(/[|:>=\-\)!~]/gm)[1].slice(1));
                  verb_attr:
                    if (param.includes("fetchw")) {
                      (async () => {
                        let oldparam = param;
                        param = param.slice(8);
                        if (window?.location?.origin) {
                          console.log(`${param}`.includes(window.location.origin));
                          param = `${param}`.includes("{{ORIG}}") ? param.replace("{{ORIG}}", window.location.origin) : param;
                          console.log(param, param.replace("." + window.location.origin));
                        }
                        console.log("QO");
                        tempC.tag = tempC.tag ? tempC.tag : "fetcherBlock";
                        tempC.data = `${tempC.data ? tempC.data + " " : ""}data-fetchw="${param}"`;
                        tempC.data = `${tempC.data} data-instance="${(/* @__PURE__ */ new Date()).getTime()}"`;
                        console.log(tempC.data);
                        let fw = await fetch(await findFile([param])) || {
                          text: () => {
                            return param;
                          }
                        };
                        let fwtext = await fw.text();
                        tempC.content = "";
                        tempC.content = `${tempC.content ? tempC.content + " " : ""}${fwtext ? fwtext : ""}`;
                        if (window?.location?.origin) {
                          $(`[${tempC.data.split(" ").join("][")}]`).innerHTML = tempC.content.replace(/\n/g, "\n</br>\n");
                        }
                        console.log(tempC, fwtext, "wizz");
                      })();
                    }
                  let damnB;
                  break;
                default:
                  tempC.tag = `${tempC.tag ? tempC.tag + " " : ""}${param}`;
                  break;
              }
            });
          };
          if (isStr !== -1) {
            let tempLines = obj.c.split(reg.betweenCol);
            let content = obj.c.split(reg.betweenQuote)[1];
            if (hasOpts !== null) {
              var inner = tempLines[1] || "";
              inner = inner.split(" ");
              checkAttr(inner);
            } else {
              tempC = def;
            }
            indexes.str++;
            tempC.content = content;
          } else {
            inner = strBuild.split(" ");
            checkAttr(inner);
          }
          var indc = indentString.repeat(level);
          obj.o = tempC;
          obj.i = indc;
          if (obj.children) {
            obj.children.forEach((child) => traverse(child, level + 1));
          }
        };
        var pubj = (chubml) => {
          let tagcheck = [
            "area",
            "base",
            "br",
            "col",
            "embed",
            "hr",
            "img",
            "input",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr"
          ];
          let shorter = false;
          var specialfind = arrMatch(chubml.o.tag, tagcheck);
          var isSpecial = specialfind.count;
          var inList = specialfind.list;
          let html = "";
          let isTemplate = false;
          switch (oml = chubml.o.tag.toLowerCase()) {
            case "chub.ComplexAccordion":
              let createAccordion2 = function(id) {
                const accordionItems = document.querySelectorAll(`#${id} .accordionItem`);
                accordionItems.forEach((item) => {
                  const header = item.querySelector(".accordionHeader");
                  const content = item.querySelector(".accordionContent");
                  header.addEventListener("click", () => {
                    content.style.display = content.style.display === "none" ? "block" : "none";
                  });
                });
              };
              var createAccordion = createAccordion2;
              ident = {
                id: "chubAccordion"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubAccordion {
      width: ${chubml.o.width || "100%"};
      margin-bottom: 20px;
    }

    .chubAccordion .accordionItem {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .chubAccordion .accordionItem .accordionHeader {
      background-color: #f5f5f5;
      padding: 10px;
      cursor: pointer;
    }

    .chubAccordion .accordionItem .accordionContent {
      padding: 10px;
      display: none;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              setTimeout(() => {
                createAccordion2(ident.counted);
              }, 0);
              break;
            case "*br":
              fboxStyle = ``;
              ident = {
                id: "mbr"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              console.log(chubml);
              chubml.o = {
                tag: "br",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              shorter = true;
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.carousel":
              let createCarousel2 = function(id) {
                const carousel = document.querySelector(`#${id}`);
                const carouselImages = carousel.querySelectorAll("img");
                const carouselControls = document.createElement("div");
                carouselControls.className = "carouselControls";
                carousel.appendChild(carouselControls);
                let currentSlide = 0;
                function showSlide(index) {
                  if (index < 0) {
                    currentSlide = carouselImages.length - 1;
                  } else if (index >= carouselImages.length) {
                    currentSlide = 0;
                  }
                  carouselImages.forEach((image) => {
                    image.style.display = "none";
                  });
                  carouselImages[currentSlide].style.display = "block";
                }
                showSlide(currentSlide);
                const prevButton = document.createElement("div");
                prevButton.className = "prev";
                prevButton.textContent = "Prev";
                prevButton.addEventListener("click", () => {
                  currentSlide--;
                  showSlide(currentSlide);
                });
                carouselControls.appendChild(prevButton);
                const nextButton = document.createElement("div");
                nextButton.className = "next";
                nextButton.textContent = "Next";
                nextButton.addEventListener("click", () => {
                  currentSlide++;
                  showSlide(currentSlide);
                });
                carouselControls.appendChild(nextButton);
              };
              var createCarousel = createCarousel2;
              ident = {
                id: "chubCarousel"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubCarousel {
      width: ${chubml.o.width || "100%"};
      position: relative;
    }

    .chubCarousel img {
      width: 100%;
      height: auto;
    }

    .chubCarousel .carouselControls {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
    }

    .chubCarousel .carouselControls .prev,
    .chubCarousel .carouselControls .next {
      cursor: pointer;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              setTimeout(() => {
                createCarousel2(ident.counted);
              }, 0);
              break;
            case "chub.chart":
              let createChart2 = function(id) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const chartData = getChartData2(chubml.o.attr);
                const chartOptions = {
                  type: "bar",
                  data: {
                    labels: chartData.labels,
                    datasets: [{
                      label: chartData.datasetLabel,
                      data: chartData.datasetData,
                      backgroundColor: chartData.datasetColor
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }
                };
                new Chart(ctx, chartOptions);
                const chartContainer = document.querySelector(`#${id}`);
                chartContainer.appendChild(canvas);
              }, getChartData2 = function(attributes) {
                const labels = attributes.labels ? attributes.labels.split(",") : [];
                const datasetLabel = attributes.datasetLabel || "Sales";
                const datasetData = attributes.datasetData ? attributes.datasetData.split(",").map(Number) : [];
                const datasetColor = attributes.datasetColor || "rgba(54, 162, 235, 0.6)";
                return {
                  labels,
                  datasetLabel,
                  datasetData,
                  datasetColor
                };
              };
              var createChart = createChart2, getChartData = getChartData2;
              ident = {
                id: "chubChart"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubChart {
      width: ${chubml.o.width || "100%"};
      height: ${chubml.o.height || "300px"};
      position: relative;
    }

    .chubChart canvas {
      width: 100%;
      height: 100%;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              setTimeout(() => {
                createChart2(ident.counted);
              }, 0);
              break;
            case "chub.tabs":
              let changeTab2 = function(event, id, tabIndex) {
                const tabButtons = document.querySelectorAll(`#${id} .chubTabButton`);
                const tabContents = document.querySelectorAll(`#${id} .chubTabContent`);
                tabButtons.forEach((button, index) => {
                  if (index === tabIndex) {
                    button.classList.add("active");
                    tabContents[index].classList.add("show");
                  } else {
                    button.classList.remove("active");
                    tabContents[index].classList.remove("show");
                  }
                });
              };
              var changeTab = changeTab2;
              ident = {
                id: "chubTabs"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubTabs .chubTabButton {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
      background-color: #f2f2f2;
      border: 1px solid #ccc;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }

    .chubTabs .chubTabButton.active {
      background-color: #fff;
      border-bottom-color: transparent;
    }

    .chubTabs .chubTabContent {
      display: none;
      padding: 20px;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 4px 4px 4px;
    }

    .chubTabs .chubTabContent.show {
      display: block;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: `
      <div class="chubTabs">
        <div class="chubTabButton" onclick="changeTab(event, '${ident.counted}', 0)">${chubml.o.tab1}</div>
        <div class="chubTabButton" onclick="changeTab(event, '${ident.counted}', 1)">${chubml.o.tab2}</div>
        <div class="chubTabContent show">${chubml.o.content1}</div>
        <div class="chubTabContent">${chubml.o.content2}</div>
      </div>
    `,
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.accordion":
              let toggleAccordion2 = function(id) {
                const accordionContent = document.querySelector(`#${id} .chubAccordionContent`);
                accordionContent.classList.toggle("show");
              };
              var toggleAccordion = toggleAccordion2;
              ident = {
                id: "chubAccordion"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubAccordion .chubAccordionTitle {
      font-weight: bold;
      cursor: pointer;
    }

    .chubAccordion .chubAccordionContent {
      display: none;
    }

    .chubAccordion .chubAccordionContent.show {
      display: block;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: `
      <div class="chubAccordionTitle" onclick="toggleAccordion('${ident.counted}')">
        ${chubml.o.title}
      </div>
      <div class="chubAccordionContent">
        ${chubml.o.content}
      </div>
    `,
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.listitem":
              ident = {
                id: "chubListItem"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubListItem {
      font-size: 16px;
      color: #333;
      list-style-type: disc;
      margin-left: 20px;
    }
  </style>
  `;
              chubml.o = {
                tag: "li",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.card":
              ident = {
                id: "chubCard"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubCard {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
  </style>
  `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.paragraph":
              ident = {
                id: "chubParagraph"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubParagraph {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }
  </style>
  `;
              chubml.o = {
                tag: "p",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.image":
              ident = {
                id: "chubImage"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubImage {
      max-width: 100%;
      height: auto;
    }
  </style>
  `;
              chubml.o = {
                tag: "img",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.button":
              ident = {
                id: "chubButton"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .chubButton {
      padding: 10px 20px;
      background-color: #f80f;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  `;
              chubml.o = {
                tag: "button",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.customheading":
              ident = {
                id: "customHeading"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              styler = `
  <style>
    .customHeading {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  </style>
  `;
              chubml.o = {
                tag: "h1",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr : "",
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.blackbg":
              fboxStyle = "";
              styler = `
          <style>
            body {
              background-color: #000;
            }
          </style>
          `;
              ident = {
                id: "bgeve"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              chubml.o = {
                tag: "",
                id: "",
                // chubml.o.id
                // ? chubml.o.id + ` ${ident.counted}`
                // : ` ${ident.counted}`, 
                class: "",
                // chubml.o.class
                // ? chubml.o.class + ` ${ident.id}`
                // : ` ${ident.id}`,
                content: "",
                // chubml.o.content
                // ? chubml.o.content
                // : "",
                data: "",
                // chubml.o.data
                // ? chubml.o.data
                // : "",
                attr: "",
                // chubml.o.attr
                // ? chubml.o.attr + " " + fboxStyle
                // : fboxStyle,
                indent: 0
                // chubml.o.i,
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              console.log(styled);
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.coolspan":
              ident = {
                id: "coolStuffspan"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              fboxStyle = "";
              styler = `
          <style>
            .coolStuffspan {
              display: inline-block;
              
              /* padding-left: var(--space-char-w); */
              /* padding-right: var(--space-char-w); */
              
              position: relative;
              animation: wavy-animation 2s infinite;
            }
          </style>
          `;
              chubml.o = {
                tag: "span",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: 0
                // chubml.o.i,
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              console.log(styled);
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.spcr":
              ident = {
                id: "spcr"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              fboxStyle = "";
              tmlo = /\/\*C(?:[^]*?)height(?:[^]*?)\(([^)]*?)\);(?:[^]*?)\*\//gm.exec(attrSyn(chubml.o.content));
              tmlo = tmlo?.[1] || "10px";
              styler = `
          <style>
            .${ident.id} {
              display: inline-block;
              
              height: ${tmlo};
            }
          </style>
          `;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id} ` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: 0
                // chubml.o.i,
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              console.log(styled);
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.lol":
              console.log("lol, test, lol\nCHUB tag Check functional!");
              break;
            case "chub.fbox":
              fboxStyle = "";
              styler = `
          <style>
            fbox {
              background-color: #f80f;
              border-radius: 10px;
              box-shadow: 6px 6px 0px 0px #000;
              display: flex;
              padding: 15px;
              
              width: min-content;
            }
          </style>
          `;
              ident = {
                id: "fbox"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : ` ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.id}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              console.log(styled);
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.fboxu":
              styler = `
          <style>
            fboxu {
              background-color: #f80f;
              border-radius: 10px;
              box-shadow: 0px 6px 0px 0px #000;
              display: flex;
              padding: 15px;
              
              width: min-content;
            }
          </style>
          `;
              ident = {
                id: "fboxu fbox"
              };
              ident.counted = ` ${indexes.tmp}${ident.id}`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${ident.counted}` : `  ${ident.counted}`,
                class: chubml.o.class ? chubml.o.class + ` ${ident.id}` : ` ${ident.counted}`,
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              if (!styled[ident.id]) {
                styled[ident.id] = true;
                if (!styled.styles)
                  styled.styles = {};
                styled.styles[ident.id] = styler;
              }
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.fboxborder":
              fboxStyle = `style="
          background-color: #f80f;
          border: 3px solid #000;
          border-radius: 10px;
          box-shadow: 6px 6px 0px 0px #000;
          display: flex;
          padding: 15px;
          
          width: min-content;
          "`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${indexes.tmp}fbox` : " fbox",
                class: chubml.o.class ? chubml.o.class + " fbox" : " fbox",
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.fboxuborder":
              fboxStyle = `style="
          background-color: #f80f;
          border: 3px solid #000;
          border-radius: 10px;
          box-shadow: 0px 6px 0px 0px #000;
          display: flex;
          padding: 15px;
          
          width: min-content;
          "`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${indexes.tmp}fbox` : " fbox",
                class: chubml.o.class ? chubml.o.class + " fbox" : " fbox",
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.prefbox":
              fboxStyle = `style="
          background-color: #f80f;
          border-radius: 10px;
          display: flex;
          padding: 15px;
          "`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${indexes.tmp}fbox` : " fbox",
                class: chubml.o.class ? chubml.o.class + " fbox" : " fbox",
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              indexes.tmp++;
              isTemplate = true;
              break;
            case "chub.prefboxborder":
              fboxStyle = `style="
          background-color: #f80f;
          border: 3px solid #000;
          border-radius: 10px;
          display: flex;
          padding: 15px;
          "`;
              chubml.o = {
                tag: "div",
                id: chubml.o.id ? chubml.o.id + ` ${indexes.tmp}fbox` : " fbox",
                class: chubml.o.class ? chubml.o.class + " fbox" : " fbox",
                content: chubml.o.content ? chubml.o.content : "",
                data: chubml.o.data ? chubml.o.data : "",
                attr: chubml.o.attr ? chubml.o.attr + " " + fboxStyle : fboxStyle,
                indent: chubml.o.i
              };
              indexes.tmp++;
              isTemplate = true;
              break;
            default:
              break;
          }
          html = `
${chubml.i}<${chubml.o.tag}`;
          if (chubml.o.class) {
            html += ` class="${chubml.o.class.slice(1)}"`;
          }
          if (chubml.o.id) {
            html += ` id="${chubml.o.id.slice(1)}"`;
          }
          if (chubml.o.style) {
            html += ` style="${chubml.o.id.slice(1)}"`;
          }
          if (chubml.o.data) {
            html += ` ${chubml.o.data}`;
          }
          if (chubml.o.attr) {
            html += ` ${chubml.o.attr}`;
          }
          if (isSpecial > 0)
            shorter = true;
          var ending = shorter ? " />\n" : ">\n";
          html += ending;
          if (!shorter) {
            if (chubml.children) {
              for (const child of chubml.children) {
                if (child.c[0] == '"') {
                  html += child.i + child.c.slice(1, child.c.length - 1);
                } else {
                  html += child.i + pubj(child);
                }
              }
            }
            html += `
${chubml.i}</${chubml.o.tag}>
`;
          } else {
            if (chubml.children) {
              for (const child of chubml.children) {
                if (child.c[0] == '"') {
                  html += child.i + child.c.slice(1, child.c.length - 1);
                } else {
                  html += child.i + pubj(child);
                }
              }
            }
            html += `
`;
          }
          if (html.search("<>"))
            html = html.replace("<>", "").replace("</>", "");
          if (html.includes("head")) {
            for (let stydm in styled.styles) {
              console.log(styled.styles[stydm]);
              if (styled[stydm] === true && styled.styles[stydm]) {
                html = html.replace("<head>", "<head>\n" + styled.styles[stydm]);
                styled[stydm] = "has";
              }
            }
          }
          return html;
        };
        traverse(contentObj, 0, vor);
        var a = pubj(contentObj);
        return a;
      };
      var sorted = sortInd(col);
      var constructed = stringi(sorted, a);
      return constructed;
    };
    var CHUBECSS;
    function sortInd(contents) {
      const sortedContents = [];
      let parentStack = [];
      contents.forEach((content) => {
        const currentIndent = content.i;
        const currentContent = { c: content.c };
        while (parentStack.length > 0 && currentIndent <= parentStack[parentStack.length - 1].i) {
          parentStack.pop();
        }
        if (parentStack.length > 0) {
          const parent = parentStack[parentStack.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(currentContent);
        } else {
          sortedContents.push(currentContent);
        }
        parentStack.push(Object.assign(currentContent, { i: currentIndent }));
      });
      return sortedContents[0];
    }
    var findFile = async (fileLocations) => {
      for (const location of fileLocations) {
        try {
          const response2 = await fetch(location);
          if (response2.ok) {
            return location;
          }
        } catch (error) {
          console.error(`Error fetching file from '${location}':`, error);
        }
      }
      return null;
    };
    var ECSSparse = async (stylesheetname) => {
      let received = "";
      let esheetproto = stylesheetname + ".ecss";
      if (findFile([esheetproto]))
        received = fetch(esheetproto);
      if (!received && findFile(["./ecss/" + esheetproto]))
        received = fetch("./ecss/" + stylesheetname + ".ecss");
    };
    function CHUBstrprep(str) {
      return str.replace(/[.*+?^${}()|[\]\\"';:]/g, "\\$&").replace(/[;]/g, "|col");
    }
    function CHUBunmess(str) {
      const escapedStr = str.replace(/\\\"/g, '"');
      const unescapedStr = escapedStr.replace(/\\\|col/g, ",");
      return [
        unescapedStr,
        JSON.parse(unescapedStr)
      ];
    }
    var CHUBduper = (dupe = "p;") => {
      window.DupeCollection ? window.DupeCollection[dupe] = window.DupeCollection[dupe] + 1 || 0 : window.DupeCollection = { [dupe]: 0 };
      editedDupe = dupe.contains(";") ? (() => {
        editedDupe = dupe.split(";");
        editedDupe[0] += ` #${window.DupeCollection[`${dupe}`] || "#0"}`;
        console.log(editedDupe);
        return editedDupe.join("");
      })() : (() => {
        return dupe + ";";
      })();
      return {
        editedDupe,
        D: window.DupeCollection,
        s: () => JSON.stringify(window.DupeCollection.toJSON()),
        c: () => JSON.parse(window.DupeCollection.toJSON())
      };
    };
    var CHUBWFetch = async (url) => {
      try {
        const response2 = await fetch(url);
        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }
        const html = await response2.text();
        console.log(htmlToChub(html));
        return htmlToChub(html);
      } catch (error) {
        console.error("Error fetching web page:", error);
        return null;
      }
    };
    var checkEnvironment = () => {
      let isImportSupported = false;
      try {
        eval("import.meta");
        isImportSupported = true;
      } catch {
      }
      if (isImportSupported) {
        return "ES Module";
      } else if (typeof module !== "undefined" && module?.exports && typeof window === "undefined") {
        return "Node";
      } else if (typeof window !== "undefined" && typeof window?.document !== "undefined") {
        return "Browser";
      } else if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
        return "Web Worker";
      } else {
        return "Unknown";
      }
    };
    switch (checkEnvironment()) {
      case "ES Module":
      case "Node":
        module.exports = {
          CHUBWFetch,
          CHUBstrprep,
          CHUBunmess,
          CHUBduper,
          CHUBfax,
          CHUBECSS,
          CHUBduper,
          CHUBparse,
          CHUBsanitize: CHUBsanitize2,
          ChubRep,
          htmlToChub
        };
        break;
      case "Browser":
        let getURLbit2 = function() {
          var url = window.location.href;
          var parts = url.split("/");
          var lastPart = parts[parts.length - 1];
          return lastPart;
        }, CHUBsanitize2 = function(input) {
          var element = document.createElement("div");
          element.innerText = input;
          var sanitizedInput = element.innerHTML;
          return sanitizedInput;
        };
        getURLbit = getURLbit2, CHUBsanitize = CHUBsanitize2;
        window.CHUBparse = CHUBparse;
        try {
          if (window.parent)
            window.parent.CHUBparse = CHUBparse;
        } catch (err) {
        }
        window.lastChub = window.lastChub || "";
        lastChub = lastChub || window.lastChub || "";
        window.cbMode = window.cbMode || "";
        cbMode = cbMode || window.cbMode || "";
        window.chubexists = true;
        window.chubExists = true;
        chubexists = true;
        chubExists = true;
        window.chubstart = window.chubstart || false;
        window.chubloaded = window.chubloaded || false;
        window.CHUBstrprep = CHUBstrprep;
        window.CHUBsanitize = CHUBsanitize2;
        ChubRep = (doc, quirky = "<!DOCTYPE html>") => {
          doc = CHUBparse(doc);
          document.open();
          document.write(quirky + "\n" + doc);
          document.close();
          return doc;
        };
        window.onload = () => {
          if (window.chubstart && typeof window.chubstart == "function") {
            chubstart();
          }
        };
        window.CHUBtxt = attrSyn;
        beamChub = async (input, DOM) => {
          var okfetch = false;
          var aliasIndexes = [
            "beam.chub",
            "beam.cml",
            "bm.chub",
            "bm.cml",
            "index.chub",
            "index.cml",
            "i.chub",
            "i.cml"
          ];
          var checkFile = async (loc, resloc = false, respo = false) => {
            var bing;
            try {
              await fetch(loc, { method: "HEAD" }).then(async (resp) => {
                if (resp.ok && resp.status !== 404) {
                  resloc = true;
                  respo = resp;
                  okfetch;
                  try {
                    bing = await fetch(loc);
                  } catch {
                    return Promise.reject("error 404");
                  }
                  return bing;
                } else if (response.status === 404) {
                  return Promise.reject("error 404");
                } else {
                  return Promise.reject("some other error: " + response.status);
                }
              });
            } catch (err) {
              return respo = err;
            }
            while (bing) {
              return bing;
            }
          };
          if (!input) {
            await findFile(aliasIndexes).then(async (foundr) => {
              if (foundr) {
                await fetch(foundr).then(async (outp) => {
                  lastChub = input;
                  window.lastChub = lastChub;
                  input = await outp.text();
                }).then(async (gotten) => {
                  var htmlCode = CHUBparse(input);
                  if (window.chubDev && window.chubDev == true)
                    console.log(htmlCode);
                  let locationB = DOM || window.chubLocation || "chub";
                  let locationGot = $(locationB);
                  if (!locationGot)
                    locationB = "body";
                  locationGot.innerHTML = htmlCode;
                  if (window.chubinjected && typeof window.chubinjected == "function") {
                    chubinjected(locationGot, window.lastChub, window.cbMode);
                  }
                });
              } else {
                console.log("No valid file location found, Tried:\n\n" + aliasIndexes.join(",\n") + "\n\nTry again using a prefered index name, or one of the indexes above.");
              }
            });
          } else {
            findFile([input]).then(async (foundr) => {
              if (foundr) {
                await fetch(foundr).then(async (outp) => {
                  lastChub = input;
                  window.lastChub = lastChub;
                  input = await outp.text();
                }).then(async (gotten) => {
                  var htmlCode = CHUBparse(input);
                  if (window.chubDev && window.chubDev == true)
                    console.log(htmlCode);
                  let locationB = DOM || window.chubLocation || "chub";
                  let locationGot = $(locationB);
                  if (!locationGot)
                    locationB = "body";
                  locationGot.innerHTML = htmlCode;
                  if (window.chubinjected && typeof window.chubinjected == "function") {
                    chubinjected(locationGot, lastChub, window.cbMode);
                  }
                });
              } else {
                console.log(`No valid file location found, Tried ${input}`);
              }
            });
          }
        };
        break;
      case "Unknown":
        break;
    }
    var ChubRep;
    var beamChub;
    var getURLbit;
    var CHUBsanitize;
    async function fetchRouteFolder(route) {
      let webver = async (_route) => {
        let _res2 = await findFile([`${_route}/chub.ware`]), _res_multiware = await findFile([`${_route}/chub.multi.ware`]), _res_core = await findFile([`${_route}/index.chub`]);
        var _ensure = async (_res3) => {
          if (_res3) {
            await fetch(_res3).then(async (res) => {
              var __res = await res.text();
              return {
                resp: res,
                location: _res3,
                text: __res
              };
            });
          } else {
            return false;
          }
        };
        let get_res = _res2 ? await _ensure(_res2) : false;
        let get_res_multiware = _res_multiware ? await _ensure(_res_multiware) : false;
        let get_res_core = _res_core ? await _ensure(_res_core) : false;
        let routeBlueprint = await get_res?.text?.() ? parseChubWare(get_res.text) : false;
        let routeMultiWare = await get_res_multiware?.text?.() ? JSON.parse(get_res_multiware.text) : false;
        if (routeMultiWare) {
          await routeMultiWare?.routes && typeof routeMultiWare?.routes == "object" ? (async () => {
            for (let _route2 in routeMultiWare.routes) {
              let __res = await fetchRouteFolder(_route2);
              routeBlueprint = {
                ...routeBlueprint,
                ...__res
              };
            }
          })() : (async () => {
          })();
        }
        console.log(
          routeBlueprint,
          routeMultiWare,
          get_res,
          get_res_multiware,
          get_res_core
        );
        return {
          _ensure,
          get_res,
          route: routeBlueprint,
          multiware: routeMultiWare,
          core: get_res_core?.text
        };
      };
      let nodever = () => {
        let __fs = global.fs ? fs : global.fs = __require("fs");
        __fs.readFile(route, (err, data) => {
          if (err) {
            return console.log(err);
          } else {
            return {
              resp: data,
              location: route,
              text: data.toString()
            };
          }
        });
      };
      switch (checkEnvironment()) {
        case "Node":
          break;
        case "Browser":
          return webver(route);
          break;
      }
    }
    function parseChubWare(chub) {
      let _ev = checkEnvironment();
      let _setting = "";
      let _mode = {
        mode: "normal",
        args: [],
        full: [],
        extras: []
      };
      let chubfiles = chub.split("\n");
      let warestruct = {};
      let waitTime = 0;
      let specialCharSyms = {
        space: "{[{SPACECHARSYM}]}"
      };
      for (let i = 0; i < chubfiles.length; i++) {
        let chubfile = chubfiles[i];
        let splitfile = chubfile.split(/\s/g);
        let _fnre = async () => {
          if (waitTime > 0) {
            await new Promise((r) => setTimeout(r, waitTime));
          }
          if (_ev == "Node") {
            if (!global.fs) {
              let __fs = global.fs = __require("fs");
              let file = __fs.readFileSync(chubfile, "utf-8");
            }
          } else if (_ev == "Browser") {
            let getURLbit3 = function(are = window.location.href) {
              var url = are;
              var parts = url.split("/");
              var lastPart = parts[parts.length - 1];
              return lastPart;
            }, getURLup2 = function(are = window.location.href) {
              var url = are;
              var parts = url.split("/");
              parts.pop();
              var joined = parts.join("/");
              return joined;
            };
            var getURLbit2 = getURLbit3, getURLup = getURLup2;
            let _loco = await findFile([
              window.origin + "/" + splitfile[1]
            ]);
            let _onPage = window.location.href == getURLup2(_loco) + "/";
            warestruct?.[_setting] ? warestruct[_setting]._lastFile = _loco : "";
            console.log(_loco);
            _res = await fetch(`${_loco}`);
            console.log(_loco, _onPage, getURLup2(_loco), window.location.href);
            let _txt = await _res.text();
            console.log(_txt);
            if (_onPage) {
              window?.onChWareLoad ? window?.onChWareLoad?.(chubfilename, _txt, warestruct) : (async (_chubfilename = chubfile, __txt = _txt) => {
                window.onChWareLoad = (chlink, _txt2) => {
                  if (!__txt) {
                    return;
                  }
                  if (_chubfilename.endsWith(".chubML") || _chubfilename.endsWith(".chml") || _chubfilename.endsWith(".ch.ware")) {
                    __txt = CHUBparse(_txt2);
                  }
                  document.open();
                  document.write(__txt);
                  window.onbeforeunload = () => {
                    document.open();
                    document.write(__txt);
                    return null;
                  };
                  document.close();
                };
                window?.onChWareLoad(_chubfilename, __txt);
              })();
            }
          }
          warestruct[_setting] ? warestruct[_setting].loaded = true : "";
          return warestruct;
        };
        if (chubfile.startsWith("@ ")) {
          let __rf = fetchRouteFolder(chubfile.slice(2).trim());
          __rf.then((__rf2) => {
            if (__rf2) {
              __rf2?.forEach?.((_file) => {
                console.log(_file);
                if (_file.endsWith(".chubML") || _file.endsWith(".chml") || _file.endsWith(".ch.ware")) {
                  CHUBWFetch(_file);
                }
              });
            }
          });
        } else if (chubfile.startsWith(" -")) {
          let chubfilename2 = chubfile.replace(" -", "").trim() || "";
          if (chubfilename2.startsWith("index")) {
            let __chubfilename = chubfilename2.split("/");
            __chubfilename.shift();
            __chubfilename = __chubfilename.join("/");
            chubfilename2 = __chubfilename;
          }
          warestruct[_setting] = {
            lastFile: chubfilename2,
            loaded: false,
            _lastFile: (() => {
              if (_ev == "Browser") {
                return `${_setting}/${chubfilename2}`;
              } else {
                return `./${_setting}/${chubfilename2}`;
              }
            })(),
            setting: _setting,
            files: warestruct?.files ? [...warestruct.files, chubfilename2] : [chubfilename2]
          };
        } else if (chubfile.startsWith("--")) {
          if (chubfile.includes(" ")) {
            let __count = 0;
            for (const __chubfile in chubfile.split(" ")) {
              __count++;
            }
            if (__count > 1) {
              let splitBy = chubfile.replace("\\ ", specialCharSyms.space).split(" ") || [];
              splitBy.map((_, i2) => {
                if (_.includes(specialCharSyms.space)) {
                  splitBy[i2] = splitBy[i2].replace(specialCharSyms.space, " ");
                }
              });
              _mode.mode = splitBy?.[2]?.trim()?.toLowerCase();
              _mode.args = splitBy?.[3]?.trim();
              _mode.full = splitBy.slice(4);
            }
            if (_mode.mode == "wait") {
              waitTime = Number(_mode.args);
            }
          }
          let chubfilename2 = chubfile.replace("--", "").trim() || "";
          if (chubfilename2.startsWith("index")) {
            let __chubfilename = chubfilename2.split("/");
            __chubfilename.shift();
            __chubfilename = __chubfilename.join("/");
            chubfilename2 = __chubfilename;
          }
          warestruct[_setting] = {
            lastFile: chubfilename2,
            loaded: "loading",
            _lastFile: (() => {
              if (_ev == "Browser") {
                return `${_setting}/${chubfilename2}`;
              } else {
                return `./${_setting}/${chubfilename2}`;
              }
            })(),
            setting: _setting,
            files: warestruct?.files ? [...warestruct.files, chubfilename2] : [chubfilename2]
          };
          console.log(warestruct);
          _fnre();
        } else if (chubfile.startsWith("|")) {
          let chubfilename2 = chubfile.replace("|", "").trim();
          if (chubfilename2.startsWith("index")) {
            let __chubfilename = chubfilename2.split("/");
            __chubfilename.shift();
            __chubfilename = __chubfilename.join("/");
            chubfilename2 = __chubfilename;
          }
          if (_ev == "Node") {
            _setting = chubfilename2;
          } else if (_ev == "Browser") {
            _setting = window.origin + "/" + chubfilename2;
          }
        }
        warestruct?.[_setting]?.loaded ? warestruct[_setting].loaded = true : "";
      }
      return warestruct;
    }
    var Router = class {
      constructor() {
        this.__env__ = checkEnvironment(opts);
        switch (this.__env__) {
          case "Node":
            break;
          case "Browser":
            break;
        }
      }
    };
    function CHUBfax(tex, sep = " ") {
      modtxt = tex || "";
      modtxt = modtxt.replace("=", "|e").replace(";", "|col").replace('"', "|qw").replace(sep, "|");
      return modtxt;
    }
    function attrSyn(tex) {
      try {
        if (`${tex}`.match(/=/gm).length > 1)
          throw errlist.eqspl3;
        let attrParam = tex.replace("=", " spcfork.Equals.Token ").replace("\\|", " spcfork.Pipe.Token ").replace(/\|e/gm, "=").replace(/\|col/gm, ";").replace(/\|qw/gm, '"').replace(/\|/gm, " ").replace(" spcfork.Pipe.Token ", "|").split(" spcfork.Equals.Token ");
        return attrParam;
      } catch {
      }
    }
    var htmlToChub = (html, delim = "") => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      function getChubML(node, indent = "") {
        let chubML = "";
        chubML += `${indent}${node.nodeName.toLowerCase()}`;
        const attrs = Array.from(node.attributes);
        if (attrs.length > 0) {
          attrs.forEach((attr) => {
            if (attr.name.toLowerCase() == "class") {
              chubML += ` .${CHUBfax(attr.value)}`;
            } else if (attr.name.toLowerCase() == "id") {
              chubML += ` #${CHUBfax(attr.value)}`;
            } else {
              chubML += ` %${attr.name}=${CHUBfax(attr.value)}`;
            }
          });
        }
        if (node.childNodes.length > 0) {
          chubML += ";\n";
          const childNodes = Array.from(node.childNodes);
          childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() != "") {
              chubML += `${indent}  "${child.textContent.trim()}";
`;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              chubML += getChubML(child, `${indent}  `);
            }
          });
          chubML += `${indent}${delim}
`;
        } else {
          chubML += ";\n";
        }
        return chubML;
      }
      return getChubML(doc.documentElement);
    };
  }
});
export default require_cml();
