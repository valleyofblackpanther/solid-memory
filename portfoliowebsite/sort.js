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
  
