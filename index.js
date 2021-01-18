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

    user: "lunnardo",
    password: "Crosscounter2",
    host: "lunnardodatabase1.c52ao3mif5t1.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "warehouse_catalog"
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
        return res.redirect('/dashboard');
    } else { //login / register page
        temp.visits = 1;
        res.end(
            `<html>
                <head>
                    <title>Warehouse Catalogue</title>
                </head>
                <body style="background-color: lightgreen; text-align: center;">
                <h1> Warehouse Catalogue</h1>
                <img src="https://foodapphci.s3.us-east-1.amazonaws.com/foodapp/logo.png" width="500" height="333">

                    <h2> Login </h2>
                    Username:
                    <input type="text" id="username" /><br />
                    Password :
                    <input type="password" id="password" /><br />
                    <input type="button" value="Submit" id="submits" />

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
                                    window.location.href = '/dashboard';
                                    window.alert('Login Sukses');
                                }
                                if (data === 'err') {
                                    window.location.href = '/dashboard';
                                    window.alert('Login gagal');
                                }
                            });
                        });
                    });
                </script>
            </html>`
        );

    }
    res.write('<a href=' + '/registerPage' + '><br>Click here to Register<br></a>');
});

router.get('/dashboard', (req, res) => {

        res.end(
            `<html>
                <head>
                    <title>Warehouse Catalogue</title>
                </head>
                <body style="background-color: lightgreen; text-align: center;">
                <h1> Warehouse Catalogue</h1>
                <img src="https://foodapphci.s3.us-east-1.amazonaws.com/foodapp/logo.png" width="500" height="333">

                </body>
            </html>`
        );


    res.write('<a href=' + '/goToProduk' + '><br>Click here to see Produk<br></a>');
    res.write('<a href=' + '/goToKaryawan' + '><br>Click here to see Karyawan<br></a>');
    res.write('<a href=' + '/goToKategori' + '><br>Click here to see Kategori<br></a>');
    res.write('<a href=' + '/goToSupplier' + '><br>Click here to see Supplier<br></a>');

});


router.get('/registerPage', (req, res) => {
    temp = req.session;
    if (temp.username && temp.visits) { //jika user terdaftar maka akan masuk ke halaman admin
        return res.redirect('/dashboard');
    } else { //login / register page
        temp.visits = 1;
        res.end(
            `<html>
                <head>
                    <title>Warehouse Catalogue</title>
                </head>
                <body style="background-color: lightgreen; text-align: center;">
                <h1> Warehouse Catalogue</h1>
                <img src="https://foodapphci.s3.us-east-1.amazonaws.com/foodapp/logo.png" width="500" height="333">

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
    res.write('<a href=' + '/' + '><br>Click here to Login<br></a>');
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


router.get('/deleteProduk', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`DROP TABLE "Produk"`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Database Deleted </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToProduk' + '>Click here to go Back<br></a>');

});

router.get('/addTableProduk', (req, res) => {
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

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Table Produk Created </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToProduk' + '>Click here to go Back<br></a>');

});

router.get('/deleteKaryawan', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`DROP TABLE "Karyawan"`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Database Deleted </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToKaryawan' + '>Click here to go Back<br></a>');

});

router.get('/addTableKaryawan', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`CREATE TABLE "Karyawan" (kar_id SERIAL PRIMARY KEY, nama_depan
      VARCHAR(30) NOT NULL, nama_belakang VARCHAR(30) NOT NULL, kar_alamat text NOT NULL);`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Table Produk Created </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToKaryawan' + '>Click here to go Back<br></a>');

});

router.get('/deleteKategori', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`DROP TABLE "Kategori"`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Database Deleted </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToKategori' + '>Click here to go Back<br></a>');

});

router.get('/addTableKategori', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`CREATE TABLE "Kategori" (k_id SERIAL PRIMARY KEY,
      k_nama VARCHAR(30) NOT NULL, k_deskripsi TEXT NOT NULL);`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Table Produk Created </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToKategori' + '>Click here to go Back<br></a>');

});

router.get('/deleteSupplier', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`DROP TABLE "Supplier"`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Database Deleted </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToSupplier' + '>Click here to go Back<br></a>');

});

router.get('/addTableSupplier', (req, res) => {
    temp = req.session;
    temp.p_id = req.body.id;
    //menghapus data_covid berdasarkan id
    //tambahkan konfigurasi delete di sini
    const del = db.query(`CREATE TABLE "Supplier" (s_id SERIAL PRIMARY KEY, s_alamat TEXT NOT NULL,
      s_telepon VARCHAR(12) NOT NULL, s_email VARCHAR(50) NOT NULL, jumlah_suplai INT NOT NULL);`)
    res.write(`<html>
    <head>
        <title>Warehouse Catalogue</title>
    </head>

    <body style="background-color: lightgreen; text-align: center;">`);
    res.write(
    `<marquee direction = "up"> Welcome ${temp.username}</marquee>
     <h2> Table Produk Created </h2>
    `
    );
    res.write('<a href=' + '/' + '>Click here to Log Out<br></a>');
    res.write('<a href=' + '/goToSupplier' + '>Click here to go Back<br></a>');

});

// Router 2: goes to a page that can only be accessed
// if the user is logged in.
router.get('/goToProduk', (req, res) => {
    temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightgreen; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<marquee direction = "up"> Welcome ${temp.username}</marquee>
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

                    <td> <a href= '/detailProduk' + '>Details</a> </td>

                  <td><a href='/deleteProduk' data-id="@item.Id" id ="linkdelete"><i class="icon-remove"></i>Delete</a></td>


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
        res.write('<a href=' + '/addProduk' + '>Click here to add an item<br></a>');
        res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
        res.write('<a href=' + '/addTableProduk' + '>Click here to Create Table<br></a>');
        res.write('<a href=' + '/dashboard' + '>Click here to go back<br></a>');
    }
    else {
        res.write('<h1>You need to log in before you can see this page.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

router.get('/goToKaryawan', (req, res) => {
    temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightgreen; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<marquee direction = "up"> Welcome ${temp.username}</marquee>
        `
        );
        temp.visits++;
        res.write( // table header
            `<table>
                <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <th>id</th>
                    <th>nama_depan</th>
                    <th>nama_belakang</th>
                    <th>alamat</th>
                </tr>`
        );
        const query = `select * from "Karyawan" ;`; // tambahkan query ambil data
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
                    <td>${row['kar_id']}</td>
                    <td>${row['nama_depan']}</td>
                    <td>${row['nama_belakang']}</td>
                    <td>${row['kar_alamat']}</td>


                  <td><a href='/deleteKaryawan' data-id="@item.Id" id ="linkdelete"><i class="icon-remove"></i>Delete</a></td>


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
        res.write('<a href=' + '/addKaryawan' + '>Click here to add an item<br></a>');
        res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
        res.write('<a href=' + '/addTableKaryawan' + '>Click here to Create Table<br></a>');
        res.write('<a href=' + '/dashboard' + '>Click here to go back<br></a>')
    }
    else {
        res.write('<h1>You need to log in before you can see this page.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

router.get('/goToKategori', (req, res) => {
    temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightgreen; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<marquee direction = "up"> Welcome ${temp.username}</marquee>
        `
        );
        temp.visits++;
        res.write( // table header
            `<table>
                <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <th>id</th>
                    <th>nama</th>
                    <th>deskripsi</th>

                </tr>`
        );
        const query = `select * from "Kategori" ;`; // tambahkan query ambil data
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
                    <td>${row['k_id']}</td>
                    <td>${row['k_nama']}</td>
                    <td>${row['k_deskripsi']}</td>



                  <td><a href='/deleteKategori' data-id="@item.Id" id ="linkdelete"><i class="icon-remove"></i>Delete</a></td>


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
        res.write('<a href=' + '/addKategori' + '>Click here to add an Kategori<br></a>');
        res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
        res.write('<a href=' + '/addTableKategori' + '>Click here to Create Table<br></a>');
        res.write('<a href=' + '/dashboard' + '>Click here to go back<br></a>')
    }
    else {
        res.write('<h1>You need to log in before you can see this page.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

router.get('/goToSupplier', (req, res) => {
    temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightgreen; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<marquee direction = "up"> Welcome ${temp.username}</marquee>
        `
        );
        temp.visits++;
        res.write( // table header
            `<table>
                <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <th>id</th>
                    <th>alamat</th>
                    <th>telepon</th>
                    <th>email</th>
                    <th>jumlah suplai</th>

                </tr>`
        );
        const query = `select * from "Supplier" ;`; // tambahkan query ambil data
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
                    <td>${row['s_id']}</td>
                    <td>${row['s_alamat']}</td>
                    <td>${row['s_telepon']}</td>
                    <td>${row['s_email']}</td>
                    <td>${row['jumlah_suplai']}</td>




                  <td><a href='/deleteSupplier' data-id="@item.Id" id ="linkdelete"><i class="icon-remove"></i>Delete</a></td>


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
        res.write('<a href=' + '/addSupplier' + '>Click here to add an Supplier<br></a>');
        res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
        res.write('<a href=' + '/addTableSupplier' + '>Click here to Create Table<br></a>');
        res.write('<a href=' + '/dashboard' + '>Click here to go back<br></a>')
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

router.get('/addProduk', (req, res) => {
  temp = req.session;
  if (temp.username) {
      res.write(`<html>
      <head>
          <title>Warehouse Catalogue</title>
      </head>

      <body style="background-color: lightgreen; text-align: center;">`);

      //tambahkan welcoming beserta username

      res.end(
      `<marquee direction = "up"> Welcome ${temp.username}</marquee>
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

                   $.post('/addItemProduk', { id: id, nama: nama, deskripsi: deskripsi, stok: stok, harga: harga, ukuran: ukuran, berat: berat }, function(data) {
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
      res.write('<a href=' + '/goToProduk' + '>Click here to go Back<br></a>');

  }
  else {
      res.write('<h1>You need to log in before you can see this page.</h1>');
      res.end('<a href=' + '/' + '>Login</a>');
  }

});

router.get('/addKaryawan', (req, res) => {
  temp = req.session;
  if (temp.username) {
      res.write(`<html>
      <head>
          <title>Warehouse Catalogue</title>
      </head>

      <body style="background-color: lightgreen; text-align: center;">`);

      //tambahkan welcoming beserta username

      res.end(
      `<marquee direction = "up"> Welcome ${temp.username}</marquee>
       <h2> Insert item to add to database</h2>
       Id Karyawan:
       <input type="text" id="kar_id" /><br />
       Nama Depan:
       <input type="text" id="nama_depan" /><br />
       Nama Belakang:
       <input type="text" id="nama_belakang" /><br />
       Alamat:
       <input type="text" id="kar_alamat" /><br />
       <input type="button" value="Add Karyawan" id="addKaryawan" /><br />
       </body>
       <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
       <script>
           jQuery(document).ready(function($) {
               var kar_id, nama_depan, nama_belakang, kar_alamat;
               $('#addKaryawan').click(function() {
                   id = $('#kar_id').val();
                   depan = $('#nama_depan').val();
                   belakang= $('#nama_belakang').val();
                   alamat = $('#kar_alamat').val();


                   $.post('/addItemKaryawan', { id: id, depan: depan, belakang: belakang, alamat: alamat}, function(data) {
                       if (data === 'done') {
                           window.alert('Karyawan berhasil ditambahkan');
                       }
                       if (data === 'err') {
                           window.alert('Karyawan gagal ditambahkan');
                       }
                   });
               });
           });
       </script>
       </html>
      `
      );


      res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
      res.write('<a href=' + '/goToKaryawan' + '>Click here to go Back<br></a>');

  }
  else {
      res.write('<h1>You need to log in before you can see this page.</h1>');
      res.end('<a href=' + '/' + '>Login</a>');
  }

});

router.get('/addKategori', (req, res) => {
  temp = req.session;
  if (temp.username) {
      res.write(`<html>
      <head>
          <title>Warehouse Catalogue</title>
      </head>

      <body style="background-color: lightgreen; text-align: center;">`);

      //tambahkan welcoming beserta username

      res.end(
      `<marquee direction = "up"> Welcome ${temp.username}</marquee>
       <h2> Insert item to add to database</h2>
       Id Kategori:
       <input type="text" id="k_id" /><br />
       Nama Kategori:
       <input type="text" id="k_nama" /><br />
       Deskripsi Kategori:
       <input type="text" id="k_deskripsi" /><br />
       <input type="button" value="Add Item" id="addKategori" /><br />
       </body>
       <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
       <script>
           jQuery(document).ready(function($) {
               var k_id, k_nama, k_deskripsi;
               $('#addKategori').click(function() {
                   id = $('#k_id').val();
                   nama = $('#k_nama').val();
                   deskripsi = $('#k_deskripsi').val();


                   $.post('/addItemKategori', { id: id, nama: nama, deskripsi: deskripsi }, function(data) {
                       if (data === 'done') {
                           window.alert('Kategori berhasil ditambahkan');
                       }
                       if (data === 'err') {
                           window.alert('Kategori gagal ditambahkan');
                       }
                   });
               });
           });
       </script>
       </html>
      `
      );


      res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
      res.write('<a href=' + '/goToKategori' + '>Click here to go Back<br></a>');

  }
  else {
      res.write('<h1>You need to log in before you can see this page.</h1>');
      res.end('<a href=' + '/' + '>Login</a>');
  }

});

router.get('/addSupplier', (req, res) => {
  temp = req.session;
  if (temp.username) {
      res.write(`<html>
      <head>
          <title>Warehouse Catalogue</title>
      </head>

      <body style="background-color: lightgreen; text-align: center;">`);

      //tambahkan welcoming beserta username

      res.end(
      `<marquee direction = "up"> Welcome ${temp.username}</marquee>
       <h2> Insert item to add to database</h2>
       Id Supplier:
       <input type="text" id="s_id" /><br />
       Alamat Supplier:
       <input type="text" id="s_alamat" /><br />
       Telepon Supplier:
       <input type="text" id="s_telepon" /><br />
       Email Supplier:
       <input type="text" id="s_email" /><br />
       Jumlah Supplier:
       <input type="text" id="jumlah_suplai" /><br />
       <input type="button" value="Add Item" id="addSuplai" /><br />
       </body>
       <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
       <script>
           jQuery(document).ready(function($) {
               var s_id, s_alamat, s_telepon, s_email, jumlah_supplai;
               $('#addSuplai').click(function() {
                   id = $('#s_id').val();
                   alamat = $('#s_alamat').val();
                   telepon = $('#s_telepon').val();
                   email = $('#s_email').val();
                   jumlah = $('#jumlah_suplai').val();


                   $.post('/addItemSupplier', { id: id, alamat: alamat, telepon: telepon, email: email, jumlah: jumlah }, function(data) {
                       if (data === 'done') {
                           window.alert('Supplier berhasil ditambahkan');
                       }
                       if (data === 'err') {
                           window.alert('Suppliergagal ditambahkan');
                       }
                   });
               });
           });
       </script>
       </html>
      `
      );


      res.write('<a href=' + '/logout' + '>Click here to log out<br></a>');
      res.write('<a href=' + '/goToSupplier' + '>Click here to go Back<br></a>');

  }
  else {
      res.write('<h1>You need to log in before you can see this page.</h1>');
      res.end('<a href=' + '/' + '>Login</a>');
  }

});

router.post('/addItemProduk', (req, res) => {
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



router.post('/addItemKaryawan', (req, res) => {
    temp = req.session;
    temp.kar_id = req.body.id;
    temp.nama_depan = req.body.depan;
    temp.nama_belakang = req.body.belakang;
    temp.kar_alamat = req.body.alamat;

    //melakukan registrasi user baru ke dalam database

    try{
        if (temp.kar_id == '' || temp.nama_depan == '' || temp.nama_belakang == '' || temp.kar_alamat == ''){
            res.end('err');
            return res.status(401).send("Harap Masukkan Semua Bidang)");
        }

    const query = `INSERT INTO "Karyawan"(kar_id, nama_depan, nama_belakang, kar_alamat) VALUES
    ('${req.body.id}', '${req.body.depan}', '${req.body.belakang}', '${req.body.alamat}')`;
db.query(query, (err,results) => {
if(err){
console.error(err);

return;
}
});
res.end('done');

}catch (error){
    console.error(err.message);
    res.status(403).send("error input")
}});


router.post('/addItemKategori', (req, res) => {
    temp = req.session;
    temp.k_id = req.body.id;
    temp.k_nama = req.body.nama;
    temp.k_deskripsi = req.body.deskripsi;

    //melakukan registrasi user baru ke dalam database

    try{
        if (temp.k_id == '' || temp.k_nama == '' || temp.k_deskripsi == ''){
            res.end('err');
            return res.status(401).send("Harap Masukkan Semua Bidang)");
        }

    const query = `INSERT INTO "Kategori"(k_id, k_nama, k_deskripsi) VALUES ('${req.body.id}',
    '${req.body.nama}', '${req.body.deskripsi}')`;
db.query(query, (err,results) => {
if(err){
console.error(err);
return;
}
});
console.log(`username '${temp.username}'Success registered!`);
res.end('done');

}catch (error){
    console.error(err.message);
    res.status(403).send("error input")
}});


router.post('/addItemSupplier', (req, res) => {
    temp = req.session;
    temp.s_id = req.body.id;
    temp.s_alamat = req.body.alamat;
    temp.s_telepon = req.body.telepon;
    temp.s_email = req.body.email;
    temp.jumlah_suplai = req.body.jumlah;

    //melakukan registrasi user baru ke dalam database

    try{
        if (temp.s_id == '' || temp.s_alamat == '' || temp.s_telepon == '' ||temp.s_email == '' ||temp.jumlah_suplai == ''){
            res.end('err');
            return res.status(401).send("Harap Masukkan Semua Bidang)");
        }

    const query = `INSERT INTO "Supplier"(s_id, s_alamat, s_telepon, s_email, jumlah_suplai) VALUES (
      '${req.body.id}', '${req.body.alamat}', '${req.body.telepon}', '${req.body.email}', '${req.body.jumlah}')`;
db.query(query, (err,results) => {
if(err){
console.error(err);

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

router.get('/detailProduk', (req, res) => {
   temp = req.session;
    if (temp.username) {
        res.write(`<html>
        <head>
            <title>Warehouse Catalogue</title>
        </head>

        <body style="background-color: lightgreen; text-align: center;">`);

        //tambahkan welcoming beserta username

        res.write(
        `<marquee direction = "up"> Welcome ${temp.username}</marquee>`
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
    res.write('<a href=' + '/goToProduk' + '>Click here to go back<br></a>');

});
