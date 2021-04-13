import os
import requests
import math
import asyncio
from collections import defaultdict
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
import datetime
import getData
import heapsort
import bfs
from flask_cors import CORS
from flask import Flask, redirect, session, request, jsonify, url_for, render_template


CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ['https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/plus.me',
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/drive.metadata.readonly']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

loop = asyncio.get_event_loop()
app = Flask(__name__, static_folder='../frontend/dist', template_folder='../frontend')
CORS(app)

app.secret_key = 'qj5fJViZ5DrW0-ShAnNsihAu'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<path:path>')
def catch_all(path):
    if path == 'matrix':
        return render_template('index.html')
    elif path == 'pancake':
        return render_template('index.html')
    elif path == 'topics':
        return render_template('index.html')
    elif path == 'math':
        return render_template('index.html')
    else:
        return path


@app.route('/calendar')
def calendar():
    return render_template('app.html')


@app.route('/authorize',  methods=['GET'])
def authorize():
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)

    flow.redirect_uri = url_for('oauth2callback', _external=True)

    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true')

    # Store the state so the callback can verify the auth server response.
    session['state'] = state

    return authorization_url


@app.route('/oauth2callback')
def oauth2callback():
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
    state = session['state']

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)

    # Store credentials in the session.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)

    return redirect(url_for('calendar'))


@app.route('/revoke')
def revoke():
    if 'credentials' not in session:
        return ('You need to <a href="/authorize">authorize</a> before ' +
                'testing the code to revoke credentials.')

    credentials = google.oauth2.credentials.Credentials(
        **session['credentials'])

    revoke = requests.post('https://accounts.google.com/o/oauth2/revoke',
                           params={'token': credentials.token},
                           headers = {'content-type': 'application/x-www-form-urlencoded'})

    status_code = getattr(revoke, 'status_code')
    if status_code == 200:
        return('Credentials successfully revoked.')
    else:
        return('An error occurred.')


@app.route('/clear')
def clear_credentials():
    if 'credentials' in session:
        del session['credentials']
    return ('Credentials have been cleared.<br><br>')


@app.route('/getData')
def test_api_request():
    if 'credentials' not in session:
        return redirect('authorize')
    events_result = get_event()
    events = events_result.get('items', {})
    t = getData.getData(events)
    return jsonify(**t)


@app.route('/sendData',  methods=['POST'])
def postdata():
    if 'credentials' not in session:
        return redirect('authorize')
    data = request.form['input']
    eventid = request.form['eventId']
    operation = request.form['operation']
    o = patch_event(data, eventid, operation)
    return jsonify(**o)


@app.route('/matrixCal',  methods=['POST'])
def calculate():
    data = request.form
    m1 = []
    m2 = []
    m = []
    k = []
    n = []
    b = []
    for key in data:
        if key[6:7] == 'A':
            try:
                if int(key[9:10]) == 0:
                    m1 += [n]
                    n = []
                    if len(m) == t:
                        m1 += [m]
                    m = []
                    m += [int(data[key])]
                else:
                    m += [int(data[key])]
            except ValueError:
                n += [int(data[key])]
                t = len(n)
        else:
            try:
                if int(key[9:10]) == 0:
                    m2 += [b]
                    b = []
                    if len(k) == a:
                        m2 += [k]
                    k = []
                    k += [int(data[key])]
                else:
                    k += [int(data[key])]
            except ValueError:
                b += [int(data[key])]
                a = len(b)
    m1 += [m]
    m2 += [k]
    boxes1 = [x for x in m1 if x]
    boxes2 = [x for x in m2 if x]
    u = [[0 for x in range(len(boxes1))] for y in range(len(boxes2[1]))]
    for i in range(0, len(boxes1)):
        for j in range(0, len(boxes2[1])):
            for o in range(0, len(boxes2)):
                u[i][j] += (boxes1[i][o] * boxes2[o][j])
    return jsonify(u)


@app.route('/matching', methods=['POST'])
def stablematching():
    data = request.form
    w = []
    h = []
    studentrank = defaultdict(list)
    hospitalpick = defaultdict(list)
    for key in data:
        if key[0:7] == 'student' and key[9:10] == ']':
            for i in data[key].split(','):
                studentrank[int(key[8:9])].append(int(i))
        elif key[0:7] == 'student' and type(int(key[8:10])) == int:
            for i in data[key].split(','):
                studentrank[int(key[8:10])].append(int(i))
        elif key[0:13] == 'hospital[pick':
            for s in data[key].split(','):
                hospitalpick[int(key[15:16])].append(int(s))
        else:
            w.append(int(key[18:19]))
            h.append(int(data[key]))
    hospitalopening = [['' for x in range(h[y])] for y in range(len(w))]
    students = [x for x in range(len(studentrank))]
    pickedstudents = []

    for hospital in range(len(w)):
        spot = 0
        while spot < len(hospitalopening[hospital]):
            Hstudent = students[hospitalpick[hospital][0]]
            if Hstudent in pickedstudents:
                for Dhospital, val in enumerate(hospitalopening):
                    if Hstudent in val:
                        ranking = {}
                        for rank, spick in enumerate(studentrank[Hstudent]):
                            ranking[spick] = rank
                        if ranking[Dhospital] > ranking[hospital]:
                            hospitalopening[hospital][spot] = Hstudent
                            hospitalopening[Dhospital].remove(Hstudent)
                            for s in hospitalpick[Dhospital]:
                                if s in pickedstudents:
                                    hospitalpick[Dhospital].remove(s)
                                    continue
                                else:
                                    nextStudent = s
                                    pickedstudents.append(s)
                                    break
                            hospitalopening[Dhospital].append(nextStudent)
                            hospitalpick[Dhospital].remove(nextStudent)
                            hospitalpick[hospital].remove(Hstudent)
                            spot += 1
                            break
                        else:
                            hospitalpick[hospital].remove(Hstudent)
                            break
            else:
                student = students[hospitalpick[hospital][0]]
                hospitalopening[hospital][spot] = student
                hospitalpick[hospital].remove(student)
                pickedstudents.append(student)
                spot += 1

    return jsonify(hospitalopening)


@app.route('/pancake', methods=['POST'])
def pancake():
    data = [int(x) for x in request.form['array'].split(',')]
    dataLen = len(data)
    steps = []
    sorted = []
    while len(sorted) != dataLen:
        maxNum = max(data)
        if data[0] != maxNum:
            try:
                maxNumberIndex = data.index(maxNum)
                for i in range(math.floor(maxNumberIndex / 2)):
                    od = data[i]
                    data[i] = data[maxNumberIndex]
                    data[maxNumberIndex] = od
                    maxNumberIndex -= 1
                steps.append(data[:])
            finally:
                maxIndex = len(data) - 1
                for x in range(math.floor((maxIndex + 1) / 2)):
                    obb = data[x]
                    data[x] = data[maxIndex]
                    data[maxIndex] = obb
                    maxIndex -= 1
                steps.append(data[:])
                data.remove(maxNum)
                sorted.insert(0, maxNum)
        else:
            maxIndex = len(data) - 1
            for x in range(math.floor((maxIndex + 1) / 2)):
                obb = data[x]
                data[x] = data[maxIndex]
                data[maxIndex] = obb
                maxIndex -= 1
            steps.append(data[:])
            data.remove(maxNum)
            sorted.insert(0, maxNum)
    return jsonify(sorted)


@app.route('/sortedList', methods=['POST'])
def sortedList():
    list1 = [int(x) for x in request.form['list1'].split(',')]
    list2 = [int(x) for x in request.form['list2'].split(',')]
    newList1 = list1.copy()
    newList2 = list2.copy()
    for e in list1:
        if e in list2:
            newList1.remove(e)
            newList2.remove(e)
    return jsonify(newList1 + newList2)


@app.route('/sumArr', methods=['POST'])
def sumArr():
    pairs = []
    sortedArr = heapsort.maxHeapSort([int(x) for x in request.form['array'].split(',')])
    randNum = int(request.form['randNum'])
    newArr = [x for x in sortedArr if x <= randNum]
    for x in newArr:
        i = randNum - x
        if i in newArr:
            pairs.append([newArr.pop(newArr.index(i)), newArr.pop(newArr.index(x))])
        else:
            continue
    return jsonify(pairs)

@app.route('/heap', methods=['POST'])
def heap():
    array = [[int(x) for x in request.form[i].split(',')] for i in request.form]
    key = 0
    totalElement = 0
    sortedArray = {}
    for i in array:
        totalElement += len(i)
        sortedArray[key] = heapsort.maxHeapSort(i)
        key += 1
    result = heapsort.minHeapSort(sortedArray, totalElement)
    return jsonify(result)

@app.route('/BFS', methods=['POST'])
def BFS():
    result = []
    distance = []
    nodes = {}
    data = [int(x) for x in request.form['edges'].split(',')]
    arr = [int(x) for x in request.form['arr'].split(',')]
    arrLength = int(len(arr) / 2) + 1
    num = len(data)
    array = defaultdict(list)
    i = 0
    while i < num:
        array[data[i]].append(data[i+1])
        i += 2
    uniqueNodes = loop.run_until_complete(bfs.getUnique(arr))
    result += loop.run_until_complete(bfs.bfs(array, uniqueNodes[0], arrLength, uniqueNodes))
    for index, i in enumerate(result):
        if (len(i) - 2) > ((arrLength - 1) / 2):
           nodes[index] = result[index]
    for i in nodes:
        arr = result[i].copy()
        del result[i]
        for node in reversed(nodes[i][1:-1]):
            t = node


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}


def patch_event(data, eventid, operation):
    if operation == 'summary':
        credentials = google.oauth2.credentials.Credentials(
            **session['credentials'])

        a = client_lib(credentials).events().patch(calendarId='primary',
                                                   eventId=eventid,
                                                   body={operation: data}).execute()
    else:
        credentials = google.oauth2.credentials.Credentials(
            **session['credentials'])

        a = client_lib(credentials).events().patch(calendarId='primary',
                                                   eventId=eventid,
                                                   body={operation: {
                                                       "dateTime": data
                                                   }}).execute()
    return a


def get_event():
    credentials = google.oauth2.credentials.Credentials(
        **session['credentials'])

    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time

    events_result = client_lib(credentials).events().list(calendarId='primary', timeMin=now,
                                                         maxResults=20, singleEvents=True,
                                                         orderBy='startTime').execute()
    session['credentials'] = credentials_to_dict(credentials)
    return events_result


def client_lib(credentials):
    return googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=credentials)





if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run('localhost', 8080, debug=True)

