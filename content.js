(function($) {
  const INTERVAL_CHECK = 30 * 1000; // 30 seconds

  const isOpen = $('.gh-header-meta .State').text().trim() === 'Open';
  const $indicatorEl = $($('.mergeability-details .completeness-indicator')[0]);

  const statusChecksPassed = function() {
    return $indicatorEl.hasClass('completeness-indicator-success');
  };

  const statusChecksFailed = function() {
    return $indicatorEl.hasClass('completeness-indicator-error');
  };

  const sendMessage = function(message) {
    chrome.runtime.sendMessage({
      message: message,
      project: project,
      title: title,
      issueNumber: issueNumber,
      url: window.location.href
    });
  }

  if (!isOpen) return;
  if (statusChecksPassed() || statusChecksFailed()) return;

  const project = $('.pagehead h1 [itemprop="name"]').text().trim();
  const title = $('.js-issue-title').text().trim();
  const issueNumber = $('.gh-header-number').text().replace('#', '');

  let statusChecker;

  const checkStatus = function() {
    if (statusChecksPassed()) {
      sendMessage('status-checks-passed');
      clearInterval(statusChecker);
    }
    else if (statusChecksFailed()) {
      sendMessage('status-checks-failed');
      clearInterval(statusChecker);
    }
  };

  statusChecker = setInterval(checkStatus, INTERVAL_CHECK);
})(jQuery);
