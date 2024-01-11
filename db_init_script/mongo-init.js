db1 = db.getSiblingDB('RAS_AUTH');
db2 = db.getSiblingDB('RAS_NOTIFICATION');

db1.counters.insertMany([{ '_id': 'users', 'seq': 0 }])

db1.users.insertMany([{
    "_id": "0",
    "name": "Tec0",
    "mec_number": "tec0",
    "username": "tec0",
    "email": "probumtec@gmail.com",
    "type": "technician",
    "active": true,
    "salt": "117c6e942c207630bd550a9806a2ea848a6f852afea0820db69a782ec2fa1a82",
    "hash": "397297d1c0a61cd9e84eeacd1174d5fcf87e35bd05a1e85f8cc6794f92a941513c00abda84f61c17e7d3f76b5afc5bc9348cf5b590d70f857935549f0918f1961ccd7a4d2a66fce1625e6ef2127b1f64a07ebd36850d4fab8a9858e4200e4c9080cd29a6a9a6eaa3428b43eab012aa200b65a33bfc948f0ed864e5afeb24dfa7ad1b3c71f58a2997bb92842605b211ceab486873da62da0da648ffea0d4fa021cb00829e77cb4127e0f17d2c3b2bd66598c65e1648bb063bb8c2ad2846a0c81d4badbfe40359b6eb7ce0c1d0ab52d32d964e6ed7565e3556e47ffd4a30e3a6d66b191079c7181275d59e91bd33be6ba1147f64074e9e88a90ccf353dd518d61141a54e69f2284aec91f79822d2e774ad6b94045f69a0cc11589353392985d1a288b0ed80b0f07ef4d34dad0667f8544d37a883c02a315c56520a547c3f016d00f40c23476ee581e821ed0d60197ebc11fc0e8e467a55f0f5be2493a32a43f722e67176592f8ab3917f28de09c700f6ecbf61b80816a986365c13eabceb1a1795ace980298b9972286ea7e24fea9bfad0bf19027e8d253d3cdf3a0e7ecab9346083ed921924195c33fd3a9312dee1abeaf149d2e4d141bbefa78b6bf19035ce8e659eda6e71b38429445e5472bbf16f50e002679d0a069ddb99c274ef5be89eb72f05b4187850588ee9efeac45315062e3e0305d49353bb51dee82b10e2d60645",
    "__v": 0
  }
  ])

db2.notifications.insertMany([{ '_id': '0', 'name': 'Tec0', 'notifications' : [] }])