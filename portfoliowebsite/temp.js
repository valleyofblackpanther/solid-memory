console.clear()
  let groupId = "";
  let agentsList = [];
  let ticketFieldsValues = [];
  let agentId = "";
  let step1 = false;
  let step2 = false;

  function getConfigs(configs) {
    const apiey = document.getElementById("apikey");
    const subdomain = document.getElementById("subdomain");
    // $('#stepTab2').hide()
    // $('#stepTab3').hide()
    apikey.value = configs.api_key;
    subdomain.value = configs.subdomain;
    groupId = configs.group_id;
    createTheSelectedOptions();
  }
  function validate() {
    const apiKey = document.getElementById("apikey");
    const subdomain = document.getElementById("subdomain");
    console.log(apiKey);
    if (step1 === true && step2 === true) return true;
    if (apikey.value === "" && subdomain.value === "") {
      return false;
    } else if (apiKey.value === "") {
      return false;
    } else if (subdomain.value === "") {
      return false;
    } else {
      console.log("error 1");
      const errorText = "please fill the next fields";
      showErrorMsg(errorText);
      return false;
    }
    console.log("error 2");
    return false;
  }

  function postConfigs() {
    var api_key = document.getElementById("apikey").value.trim();
    var subdomain = document.getElementById("subdomain").value;
    console.log(api_key);
    console.log(subdomain);
    return {
      __meta: {
        secure: ["api_key"],
      },
      api_key,
      subdomain,
      ticketFieldValues: ticketFieldValues,
      group_id: Number(groupId),
    };
  }

  function submitBUTTON() {
    if (groupId != "" && agentId != "" && ticketFieldsValues != []) {
      showSuccessMsg("Your validation is success🎇🎆🎉✨🎊");
      step2 = true;
    } else {
      showErrorMsg("Your validation has failed 😫😣😮😭😑");
    }
  }

  function radioDisabled() {
    for (let each of ticketFieldsValues) {
      client.interface
        .trigger("disable", { id: each })
        .then(function (data) {})
        .catch(function (error) {
          // error - error object
        });
    }
  }

  function radioHidden() {
    for (let each of ticketFieldsValues) {
      client.interface
        .trigger("hide", { id: each })
        .then(function (data) {})
        .catch(function (error) {
          // error - error object
        });
    }
  }

  function onclickValidateButton() {
    const api_key = document.getElementById("apikey");
    const subdomain = document.getElementById("subdomain");
    if (api_key.value === "" && subdomain.value === "") {
      const errorText = "Please Enter the API key & Subdomain";
      showErrorMsg(errorText);
    } else if (api_key.value === "") {
      const errorText = "Please Enter the API key";
      showErrorMsg(errorText);
    } else if (subdomain.value === "") {
      const errorText = "Please Enter the Subdomain";
      showErrorMsg(errorText);
    } else {
      step1 = true;
      $(".loading").show();
      // $("#stepTab1").css({ opacity: 0.2 })
      console.log("subdomain", subdomain);
      let agentFieldsPromise = getGroupFields(
        `https://${subdomain.value}.freshdesk.com/api/v2/admin/groups`
      );
      // console.log('onClickValidation Response', JSON.parse(agentFieldsPromise))
      agentFieldsPromise.then(function (data) {
        console.log("agents data", data);
        const groupsData = JSON.parse(data.response);
        console.log(groupsData);
        createTheSelectedOptions(groupsData);
        let ticketFielsPromise = getGroupFields(
          `https://${subdomain.value}.freshdesk.com//api/v2/ticket_fields`
        );
        ticketFielsPromise.then(function (Tdata) {
          console.log("Tickets data", Tdata);
          const ticketFields = JSON.parse(Tdata.response);
          console.log("ticket fields data", ticketFields);
          createTicketFields(ticketFields);
        });
        document.getElementById("fwTabs").setAttribute("active-tab-index", 1);
      });

      // createTheSelectedOptions(agentData)
      // const agentData = JSON.parse(data.response);
      //     console.log("GROUP DATA >>>>>>", agentData);
    }
  }

  const createTicketFields = (ticketFields) => {
    const selectEleContainer = document.getElementById(
      "selectEleTicketFieldsCon"
    );
    const selectEle = document.createElement("fw-select");
    selectEle.setAttribute("label", "Names");
    selectEle.setAttribute("placeholder", "Your choices");
    selectEle.setAttribute("hint-text", "Select multiple options");
    selectEle.setAttribute("multiple", true);

    selectEle.innerHTML = "";
    selectEle.innerHTML += "<fw-select-option>Select group</fw-select-option>";
    for (let each of ticketFields) {
      const op = document.createElement("fw-select-option");
      // if (Number(groupId) === v) {
      //   console.log("checked")
      //   op.selected = true
      // }
      op.value = each.id;
      op.innerHTML = each.name;
      selectEle.appendChild(op);
    }
    selectEleContainer.appendChild(selectEle);
    selectEle.addEventListener("fwChange", (event) => {
      console.log("IN eventlistener");
      ticketFieldValues = event.target.value;
      console.log("ticketFieldsValues", ticketFieldValues);
    });
  };

  function getGroupFields(rrr) {
    return new Promise(function (resolve, reject) {
      app.initialized().then(function (client) {
        var api_key = document.getElementById("apikey").value.trim();
        var subdomain = document.getElementById("subdomain").value;
        // configData.apiKey = api_key
        // configData.subdomain = subdomain
        console.log("apiKey & subdomain~ ", api_key, subdomain);

        var headers = {
          Authorization: `Basic ${btoa(api_key)}`,
          "Content-Type": "application/json",
        };
        var options = { headers: headers };

        var url = rrr;

        client.request.get(url, options).then(
          function (data) {
            // $(".loading").hide()
            // $("#stepTab1").css({ opacity: 1 })
            // step1 = true
            // $('#stepTab2').show()
            // $('#stepTab2').hide()
            resolve(data);
          },
          function (error) {
            //handle error
            reject({
              source: "Freshdesk",
              Message: "Validation Error Subdomain and API key doesn't match!",
              error,
            });
          }
        );
      });
    });
  }

  function createTheSelectedOptions(convData) {
    console.log("In get Select");
    console.log("totoal ticketFields >>>>>>>", convData);

    let great = [];
    for (let each of convData) {
      great.push({ id: each.id, name: each.name, agentsList: each.agent_ids });
    }
    console.log("ID DATA >>>", great);

    // if (step2 === true) {
    const selectEleCo = document.getElementById("selectEleCont");
    const selectEle = document.createElement("fw-select");
    selectEle.innerHTML = "";
    selectEle.innerHTML += "<fw-select-option>Select group</fw-select-option>";
    for (let each of great) {
      const op = document.createElement("fw-select-option");
      // if (Number(groupId) === v) {
      //   console.log("checked")
      //   op.selected = true
      // }
      op.value = each.id;
      op.innerHTML = each.name;

      selectEle.appendChild(op);
    }
    selectEleCo.appendChild(selectEle);
    selectEle.addEventListener("fwChange", (event) => {
      console.log("IN eventlistener");
      groupId = event.target.value;
      console.log("great", great);
      for (let each of great) {
        if (each.id === groupId) {
          agentsList = each.agentsList;
        }
      }
      // agentsList=great.filter(each=>each.id===groupId ? console.log(each.group_id) : null )
      console.log("agents List", agentsList);
      console.log("groupId >>", groupId);
      var subdomain = document.getElementById("subdomain").value;
      const agentsDataPromise = getGroupFields(
        `https://${subdomain}.freshdesk.com/api/v2/agents`
      );
      console.log("agentsPromise", agentsDataPromise);
      agentsDataPromise.then(function (data) {
        console.log("agents data", data);
        const Data = JSON.parse(data.response);
        console.log(Data);
        displayAgentsData(Data);
        // document.getElementById('fwTabs').setAttribute('active-tab-index', 1);
      });
    });
  }

  const displayAgentsData = (data) => {
    console.log("display agents data", data);
    let agentsData = [];
    for (let each of data) {
      if (agentsList.includes(each.id)) {
        agentsData.push({
          id: each.id,
          name: each.contact.name,
          email: each.contact.email,
        });
      }
    }
    console.log("filtered Agents", agentsData);
    const agentContainer = document.getElementById("selectEleAgentsCon");
    agentContainer.innerHTML = "";
    const selectEle = document.createElement("fw-select");
    selectEle.innerHTML = "";
    selectEle.innerHTML += "<fw-select-option>Select group</fw-select-option>";
    for (let each of agentsData) {
      const op = document.createElement("fw-select-option");
      // if (Number(groupId) === v) {
      //   console.log("checked")
      //   op.selected = true
      // }
      op.value = each.id;
      op.innerHTML = each.email;
      selectEle.appendChild(op);
    }
    agentContainer.appendChild(selectEle);
    selectEle.addEventListener("fwChange", (event) => {
      console.log("IN eventlistener");
      agentId = event.target.value;
      console.log("AGENTId >>>>>>>>>>>", agentId);
    });
  };

  function showSuccessMsg(text) {
    const errorEle = document.getElementById("Success-Error");
    errorEle.innerHTML = `${text}`;
    errorEle.classList.add("successHig");
    setTimeout(() => {
      errorEle.innerHTML = "";
      errorEle.classList.remove("successHig");
    }, [5000]);
  }

  function showErrorMsg(err) {
    const errorEle = document.getElementById("Success-Error");
    errorEle.innerHTML = `${err}`;
    errorEle.classList.add("errorHig");
    setTimeout(() => {
      errorEle.innerHTML = "";
      errorEle.classList.remove("errorHig");
    }, [5000]);
    console.log("er ~", err);
  }
  getConfigs()
  validate()
  postConfigs()
  submitBUTTON()
  radioDisabled()
  radioHidden()
  onclickValidateButton()


  document.onreadystatechange = function () {
    if (document.readyState === "interactive") renderApp();
  
    function renderApp() {
      var onInit = app.initialized();
  
      onInit.then(getClient).catch(handleErr);
  
      function getClient(_client) {
        window.client = _client;
        console.log("clifghjent", window.client.iparams);
        client.events.on("app.activated", onAppActivate);
      }
    }
  };
  
  async function onAppActivate() {
    try {
      var getContact = await client.data.get("ticket");
      console.log("ticket data >>>", getContact);
      const iparams = await client.iparams.get();
      console.log("iparam data >>>", iparams);
      const ticketID = await getContact.ticket.id;
      console.log("ticket id >>>", ticketID);
      const ticketField = await iparams.ticketFieldValues;
      console.log("ticket_field >>>", ticketField);
      const groupId = await iparams.group_id;
      console.log("groupId >>>", groupId);
      const agentId = await iparams.agent_id;
      console.log("agentId >>>", agentId);
      var responderId = await getContact.ticket.responder_id;
      console.log("reponder id  >>>>", responderId);
      const ishidden = await iparams.is_Hidden;
      console.log("hidden", ishidden);
      const isdisable = await iparams.is_Disable;
      console.log("disable", isdisable);
      const actionnn = await iparams.action_id;
      console.log("ACTION >>>>", actionnn);
    } catch (e) {
      handleErr(e);
    }
  
    function handleErr(err) {
      console.error(`Error occured detils:`, err);
    }
  
    client.data.get("loggedInUser").then(
      function (data) {
        console.log("data >>>>>", data);

        LOGGEDID = data.loggedInUser.contact.id;
        console.log("logged id >>>>", LOGGEDID);

        for(let eachI of agent_details){
          eachI=JSON.parse(eachI)
        console.log("fcuk >>>",typeof(eachI.id));
        if (LOGGEDID === (eachI.id)) {
          if (isdisable === true) {
            for (let each of ticketField) {
              client.interface
                .trigger("disable", { id: each })
                .then(function (data) {
                  console.log("DISABLE DATA >>>>>", data);
                })
                .catch(function (error) {
                  // error - error object
                });
            }
          } else {
            for (let each of ticketField) {
              client.interface
                .trigger("hide", { id: each })
                .then(function (data) {
                  console.log("HIDDEN DATA >>>>", data);
                })
                .catch(function (error) {
                  // error - error object
                });
            }
          }
        } else {
          console.log("No process");
        }}
      },
      function (error) {
        // failure operation
      }
    );
  } catch (e) {
    handleErr(e);
  }
}
    if (agentId === responderId) {
      if (actionnn === "dis") {
        function radioDisabled(ticketField) {
          for (let each of ticketField) {
            client.interface
              .trigger("disable", { id: each })
              .then(function (data) {
                console.log("DISABLE DATA >>>>>");
              })
              .catch(function (error) {
                // error - error object
              });
          }
        }
      } else {
        function radioHidden(ticketField) {
          for (let each of ticketField) {
            client.interface
              .trigger("hide", { id: each })
              .then(function (data) {})
              .catch(function (error) {
                // error - error object
              });
          }
        }
      }
    } else {
    }
  
  
  
    // Check COndition - compare ticket details & Iparams
  
    // Yes -> Hide/Disable
  
    // No -> No Process
  }
  
