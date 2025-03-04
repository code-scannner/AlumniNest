import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDtwbd2nj_Su5c8dryv6YxjedbSKus2MjY',
  authDomain: 'alumninest-fe1b7.firebaseapp.com',
  databaseURL: 'https://alumninest-fe1b7.firebaseio.com',
  projectId: 'alumninest-fe1b7',
  storageBucket: 'alumninest-fe1b7.appspot.com',
  messagingSenderId: '51039534365',
  appId: '1:51039534365:android:77a4ffa3748b3317e575f4',
//   measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase