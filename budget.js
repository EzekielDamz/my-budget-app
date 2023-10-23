//MODULES

const budgetController = (function () {
  const Expence = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expence.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentages = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expence.prototype.getPercentages = function () {
    return this.percentages;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calcuateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  //data structure

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      let newItems, ID;
      // CREATE NEW ID
      if (data.allItems[type].lenght > 0) {
        ID = data.allItems[type][data.allItems[type].lenght - 1].id + 1;
      } else {
        ID = 0;
      }

      //CREATE NEW ITEM BASED ON 'INC' OR 'EXP' TYPE

      if (type === "exp") {
        newItems = new Expence(ID, des, val);
      } else if (type === "inc") {
        newItems = new Income(ID, des, val);
      }

      //PUSH IT INTO OUR DATA STRUCTURE

      data.allItems[type].push(newItems);
      //RETURN THE NEW ELEMENT

      return newItems;
    },

    deleItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map(function (current) {
        return current, id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // 1.calulate the total income and expence
      calcuateTotal("exp");
      calcuateTotal("inc");
      // 2. calculate the budget income - expenses

      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc < 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      const allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentages();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//UI CONTROLLER

const UIController = (function () {
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    IncomeContainer: ".income__list",
    ExpensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    IncomeLabel: ".budget__income--value",
    ExpenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    ExpensesPercLabel: ".item__percentage",
    yearLabel: ".budget__title--month",
  };
  const formattingNumber = function (num, type) {
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(" . ");
    int = numSplit[0];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) + int.substr(int.length - 3, 3); // input 23150, output 23,510
    }
    dec = numSplit[1];

    return (type === "exp" ? " - " : "+") + " " + int;
  };
  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be inc or expen
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;
      //Create HTML strings with placeholder text
      if (type === "inc") {
        element = DOMstrings.IncomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.ExpensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formattingNumber(obj.value, type));
      //Insert the HTML into the Dom
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function (selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearField: function () {
      let field, fieldArr;
      field = document.querySelectorAll(
        DOMstrings.inputDescription + " , " + DOMstrings.inputValue
      );

      fieldArr = Array.prototype.slice.call(field);

      fieldArr.forEach(function (current) {
        current.value = "";
      });
      fieldArr[0].focus();
    },
    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent =
        formattingNumber(obj.budget, type);
      document.querySelector(DOMstrings.IncomeLabel).textContent = formattingNumber(obj.totalInc), 'inc';
      document.querySelector(DOMstrings.ExpenseLabel).textContent =
        formattingNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.ExpensesPercLabel);

      

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = " ---";
        }
      });
    },

    displayMonth: function () {
      let now, year, month, months, day;
      now = new Date();
      months = [' January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      year = now.getFullYear();
      month = now.getMonth();
    
      document.querySelector(DOMstrings.yearLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function () {
      let changeField;
      changeField = document.querySelectorAll(
        DOMstrings.inputType + ' , ' +
        DOMstrings.inputValue + ' , ' +
        DOMstrings.inputDescription);
      nodeListForEach(changeField, function (cur) {
      cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle("red")
    },

    getDomstrings: function () {
      return DOMstrings;
    },
  };
})();

const controller = (function (budgetCtrl, UICtrl) {
  const setUpEventListener = function () {
    const Dom = UICtrl.getDomstrings();
    document.querySelector(Dom.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(Dom.container)
      .addEventListener("click", CtrlDeleteItem);
    document.querySelector(Dom.inputType).addEventListener('change', UICtrl.changedType)
  };

  const updataBudget = function () {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    let percentages;
    // 1. calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget
    percentages = budgetCtrl.getPercentages();
    // 3. update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function () {
    let input, newItems;

    // 1. get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add the item to the budget controller
      newItems = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add the item to the UI
      UICtrl.addListItem(newItems, input.type);
      // 4. clear input field
      UICtrl.clearField();
      // 5. calculate and update budget
      updataBudget();
      // 6. calculate and update percentages
      updatePercentages();
    }
  };

  const CtrlDeleteItem = function (event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1

      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleItem(type, ID);
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updataBudget();
      // 4. calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("application is now working");
      UICtrl.displayMonth(); 
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setUpEventListener();
    },
  };
})(budgetController, UIController);

controller.init();
