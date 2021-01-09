//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

//Insiasi koneksi ke database
const db = new Client({

    user: "postgres",
    password: "",
    host: "",
    port: 5432,
    database: "uas_sbd"
    //isi dengan konfigurasi database anda


});

//Melakukan koneksi dan menunjukkan indikasi database terhubung

//jalankan koneksi ke database

db.connect((err) =>{
    if (err) {
        console.error(err);
        return;
    }
    console.log('Database Connected');
});

//middleware (session)
app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: false,
        resave: false
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

var temp;

//ROUTERS

//Router 1: Menampilkan landing page (login/register)
router.get('/', (req, res) => {
    temp = req.session;
    if (temp.username && temp.visits) { //jika user terdaftar maka akan masuk ke halaman admin
        return res.redirect('/admin');
    } else { //login / register page
        temp.visits = 1;
        res.end(
            `<html>
                <head>
                    <title>Warehouse Catalogue</title>
                </head>
                <body style="background-color: lightblue; text-align: center;">
                    <h1> Warehouse Catalogue</h1>
                    <h2> Login </h2>
                    Username:
                    <input type="text" id="username" /><br />
                    Password :
                    <input type="password" id="password" /><br />
                    <input type="button" value="Submit" id="submits" />

                    <h2> Register </h2>
                    Username:
                    <input type="text" id="usernames" /><br />
                    Password :
                    <input type="password" id="passwords" /><br />
                    <input type="button" value="Submit" id="register" />

                </body>
                <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
                <script>
                    jQuery(document).ready(function($) {
                        var username, pass;
                        $('#submits').click(function() {
                            username = $('#username').val();
                            pass = $('#password').val();

                            $.post('/login', { username: username, pass: pass }, function(data) {
                                if (data === 'done') {
                                    window.location.href = '/admin';
                                    window.alert('Login Sukses');
                                }
                                if (data === 'err') {
                                    window.location.href = '/admin';
                                    window.alert('Login gagal');
                                }
                            });
                        });
                        $('#register').click(function() {
                            username = $('#usernames').val();
                            pass = $('#passwords').val();

                            $.post('/register', { username: username, pass: pass }, function(data) {
                                if (data === 'done') {

                                    window.alert('Registrasi Sukses');
                                }
                                if (data === 'err') {

                                    window.alert('Registrasi Salah/Gagal');
                                }
                            });
                        });
                    });
                </script>
            </html>`
        );
    }
});

//Router 2: for login operation
router.post('/login', (req, res) => {
    temp = req.session;
    temp.username = req.body.username;
    temp.password = req.body.pass;

    //mengecek informasi yang dimasukkan user apakah terdaftar pada database

    //tambahkan konfigurasi login di sini

    const query = `SELECT password from users where username ='${temp.username}'`;
db.query(query, (err,results) => {
if (err){
    console.error(err);
    res.send(err);
    requestAnimationFrame;
}
else{
    console.log(results.rows[0].password[0]);
}
hash = results.rows[0].password[0];
bcrypt.compare(temp.password, hash, function(err,result){
if(err){
console.err(err);
res.send(err);
return;

}
else{
    console.log(`successful login`);
    res.end('done');
}
});
});
});
router.post('/register', (req, res) => {
    temp = req.session;
    temp.username = req.body.username;
    temp.password = req.body.pass;
    //melakukan registrasi user baru ke dalam database

    try{
        if (temp.username == '' || temp.password == ''){
            res.end('err');
            return res.status(401).send("Please insert Username and Password (can't be empty)");
        }
    const hashedPass = bcrypt.hash(temp.password, 10, function (err, hashedPass){
    const query = `INSERT INTO users(username, password, is_admin) VALUES ('${req.body.username}',
    '${hashedPass}', false)`;
db.query(query, (err,results) => {
if(err){
console.error(err);
res.send(err);

return;
}
});
console.log(`username '${temp.username}'Success registered!`);
res.end('done');
});
}catch (error){
    console.error(err.message);
    res.status(403).send("error input")
}});


router.get('/delete', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`DROP TABLE "Produk"`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightblue; text-align: center;">`);
    res.write(
    `<h1> Welcome ${temp.username}</h1>
     <h2> Database Deleted </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/admin' + '>Click here to go Back<br></a>');

});

router.get('/addTable', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`create table "Produk"(p_id serial PRIMARY KEY, p_nama varchar(20) NOT NULL,
                          p_deskripsi text NOT NULL, p_stok int NOT NULL, p_harga float NOT NULL,
                          p_ukuran float NOT NULL, p_berat float NOT NULL);`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightblue; text-align: center;">`);
    res.write(
    `<h1> Welcome ${temp.username}</h1>
     <h2> Table Produk Created </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/admin' + '>Click here to go Back<br></a>');

});

// Router 2: goes to a page that can only be accessed
// if the user is logged in.
router.get('/admin', (req, res) => {
    temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightblue; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<h1> Welcome ${temp.username}</h1>
        `
        );
        temp.visits++;
        res.write( // table header
            `<table>
                <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <th>id</th>
                    <th>nama</th>

                    <th>stok</th>
                    <th>harga</th>

                </tr>`
        );
        const query = `select * from "Produk" ;`; // tambahkan query ambil data
        db.query(query, (err, results) => {
            if (err) {
                console.error(err.detail);
                res.send(err.detail)
                return;
            }
            for (row of results.rows) { // tampilin isi table
                res.write(
                    `
                    <tr>
                    <td style="text-align: center; vertical-align: middle;">
                    <td>${row['p_id']}</td>
                    <td>${row['p_nama']}</td>

                    <td>${row['p_stok']}</td>
                    <td>${row['p_harga']}</td>


                    <td> <a href= '/detail' + '>Details</a> </td>
                    >
                  <td><a href='/delete' data-id="@item.Id" id ="linkdelete"><i class="icon-remove"></i>Delete</a></td>


                    `
                );

                console.log(row);
            }
            res.end(`</table>
            </body>
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js%22%3E</script>
            <script>
            jQuery(document).ready(function($) {
              $("#linkdelete").click(function (e) {
              var obj = $(this); // first store $(this) in obj
              var id = $(this).data('id'); // get id of data using this
              $.ajax({
                  url: "/delete",
                  data: { id: id },
                  //cache: false,
                  //contentType: false,
                  //processData: false,
                  //mimeType: "multipart/form-data",
                  type: "Post",
                  dataType: "Json",
                  success: function(result) {
                      if (result.Success) {
                          $(obj).closest("tr").remove(); // You can remove row like this
                      }
                      eval(result.Script);
                  },
                  error: function() {
                      alert("خطا!");
                  }
              });
          });
        </script>


// isi dengan konfigurasi delete data berdasarkan id



            </html>`);
            console.log('Data Fetch successful');
        });
        res.write('<a href=' + '/Item' + '>Click here to add an item<br></a>');
        res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
        res.write('<a href=' + '/addTable' + '>Click here to Create Tablet<br></a>');
    }
    else {
        res.write('<h1>You need to log in before you can see this page.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

//Router 4: mengheapus session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

router.get('/Item', (req, res) => {
  temp = req.session;
  if (temp.username) {
      res.write(`<html>
      <head>
          <title>Warehouse Catalogue</title>
      </head>

      <body style="background-color: lightblue; text-align: center;">`);

      //tambahkan welcoming beserta username

      res.end(
      `<h1> Welcome ${temp.username}</h1>
       <h2> Insert item to add to database</h2>
       Id Barang:
       <input type="text" id="p_id" /><br />
       Nama Barang:
       <input type="text" id="p_nama" /><br />
       Deskripsi Barang:
       <input type="text" id="p_deskripsi" /><br />
       Stok Barang:
       <input type="text" id="p_stok" /><br />
       Harga Barang:
       <input type="text" id="p_harga" /><br />
       Ukuran Barang:
       <input type="text" id="p_ukuran" /><br />
       Berat Barang:
       <input type="text" id="p_berat" /><br />
       <input type="button" value="Add Item" id="add" /><br />
       </body>
       <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
       <script>
           jQuery(document).ready(function($) {
               var p_id, p_nama, p_deskripsi, p_stok, p_harga, p_ukuran, p_berat;
               $('#add').click(function() {
                   id = $('#p_id').val();
                   nama = $('#p_nama').val();
                   deskripsi = $('#p_deskripsi').val();
                   stok = $('#p_stok').val();
                   harga = $('#p_harga').val();
                   ukuran = $('#p_ukuran').val();
                   berat = $('#p_berat').val();

                   $.post('/addItem', { id: id, nama: nama, deskripsi: deskripsi, stok: stok, harga: harga, ukuran: ukuran, berat: berat }, function(data) {
                       if (data === 'done') {
                           window.alert('Barang berhasil ditambahkan');
                       }
                       if (data === 'err') {
                           window.alert('barang gagal ditambahkan');
                       }
                   });
               });
           });
       </script>
       </html>
      `
      );


      res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
      res.write('<a href=' + '/admin' + '>Click here to go Back<br></a>');

  }
  else {
      res.write('<h1>You need to log in before you can see this page.</h1>');
      res.end('<a href=' + '/' + '>Login</a>');
  }

});

router.post('/addItem', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    temp.p_nama = req.body.nama;
    temp.p_deskripsi = req.body.deskripsi;
    temp.p_stok = req.body.stok;
    temp.p_harga = req.body.harga;
    temp.p_ukuran = req.body.ukuran;
    temp.p_berat = req.body.berat;

    //melakukan registrasi user baru ke dalam database

    try{
        if (temp.p_id == '' || temp.p_nama == '' || temp.p_deskripsi == '' ||temp.p_stok == '' ||temp.p_harga == '' ||temp.p_ukuran == '' ||temp.p_berat == ''){
            res.end('err');
            return res.status(401).send("Harap Masukkan Semua Bidang)");
        }

    const query = `INSERT INTO "Produk"(p_id, p_nama, p_deskripsi, p_stok, p_harga, p_ukuran, p_berat) VALUES ('${req.body.id}',
    '${req.body.nama}', '${req.body.deskripsi}', '${req.body.stok}', '${req.body.harga}', '${req.body.ukuran}', '${req.body.berat}')`;
db.query(query, (err,results) => {
if(err){
console.error(err);
res.send(err);

return;
}
});
console.log(`username '${temp.username}'Success registered!`);
res.end('done');

}catch (error){
    console.error(err.message);
    res.status(403).send("error input")
}});
app.use('/', router);
app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});

router.get('/detail', (req, res) => {
   temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightblue; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<h1> Welcome ${temp.username}</h1>
        `
    );
        }
        temp.visits++;
        res.write( // table header
            `<table>
                <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <th>id</td>
                    <th>nama</th>
                    <th>deskripsi</th>
                    <th>stok</th>
                    <th>harga</th>
                    <th>ukuran</th>
                    <th>berat</th>
                </tr>`
        );
        const query = `select * from "Produk" ;`; // tambahkan query ambil data
        db.query(query, (err, results) => {
            if (err) {
                console.error(err.detail);
                res.send(err.detail)
                return;
            }
            for (row of results.rows) { // tampilin isi table
                res.write(
                    `
                    <tr>
                    <td style="text-align: center; vertical-align: middle;">
                    <td>${row['p_id']}</td>
                    <td>${row['p_nama']}</td>
                    <td>${row['p_deskripsi']}</td>
                    <td>${row['p_stok']}</td>
                    <td>${row['p_harga']}</td>
                    <td>${row['p_ukuran']}</td>
                    <td>${row['p_berat']}</td>
                    `
                );
                console.log(row);
            }
    });
    res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
    res.write('<a href=' + '/admin' + '>Click here to go back<br></a>');

});
