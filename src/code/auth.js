const spreadsheetId = '1ocS8qTdZcAzhYusjTEplPhcg5WxYPxw6hBBo7eXRI8A' //https://docs.google.com/spreadsheets/d/1ocS8qTdZcAzhYusjTEplPhcg5WxYPxw6hBBo7eXRI8A/edit#gid=152798628
const API_KEY = 'AIzaSyAxBFmX4mCjZhredt7EGbGsxc3wdT336MU';
const CLIENT_ID = '111636053650-tfu64uvbrtn0vejgtskt9fftigcugctj.apps.googleusercontent.com'
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
let tokenClient;
let gapiInited = false;
let gisInited = false;

let btn_auth = document.getElementById('authorize_button');
let btn_sigout = document.getElementById('signout_button');
btn_auth.setAttribute('hidden', '')
btn_sigout.setAttribute('hidden', '')


function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}


function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

async function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        await handleAuthClick()
        btn_auth.removeAttribute('hidden')
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        btn_sigout.removeAttribute('hidden')
        btn_auth.innerText = 'Refresh';
        let form = document.querySelector('form')
        if(form){
            form.removeAttribute('hidden')
        }
        await loadedWindow();
    };
    /* The trap */
    gapi.client.setToken('accessToken')
    if (gapi.client.getToken() === null) {    
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
        
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}
//tokenClient = JSON.parse(localStorage.getItem('tokenClient'));

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        btn_auth.innerText = 'Authorize';
        btn_sigout.setAttribute('hidden','');
    }
}
  

