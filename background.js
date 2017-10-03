var pullRequestNotifications = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "status-checks-passed" ) {
      let notificationId = `central-${request.issueNumber}`;
      pullRequestNotifications[notificationId] = {url: request.url};

      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'Github-icon.png',
        title: 'Status Checks Succeeded!',
        message: `"${request.title}" passed all status checks`,
        contextMessage: request.project
      });
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "status-checks-failed" ) {
      let notificationId = `central-${request.issueNumber}`;
      pullRequestNotifications[notificationId] = request.url;

      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'Github-icon.png',
        title: 'Status Checks Failed!',
        message: `"${request.title}" did not pass all status checks`,
        contextMessage: request.project
      });
    }
  }
);

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (!pullRequestNotifications[notificationId]) return;

  chrome.tabs.create({"url": pullRequestNotifications[notificationId].url});
});
