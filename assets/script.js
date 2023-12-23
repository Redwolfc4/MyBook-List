Books1 = []
Books2 = []
sessionBooks1 = []
sessionBooks2 = []

// document utama
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Storage === 'undefined') {
    alert('Browser does not support local storage')
    window.location.reload()
  }

  // document.getElementById('search-book').onfocus = function () {
  //   document.getElementById('pencarian').style.border = '2px solid #0c0253'
  // }

  if (
    localStorage.getItem('Books1') !== null &&
    localStorage.getItem('Books1') !== ''
  ) {
    temp_html = ''
    let books = JSON.parse(localStorage.getItem('Books1'))

    for (const book of books) {
      Books1.push(book)
      data = tampil_book(
        book.title,
        book.image,
        book.author,
        book.year,
        book.id,
        book.isComplete
      )
      window.temp_html += data
    }
    console.log(temp_html)
    document.querySelector('#tampilsection1 .row').innerHTML = temp_html
  } else if (localStorage.getItem('Books1') == null) {
    localStorage.setItem('Books1', '')
  }

  if (
    localStorage.getItem('Books2') !== null &&
    localStorage.getItem('Books2') !== ''
  ) {
    temp_html = ''
    let books = JSON.parse(localStorage.getItem('Books2'))

    for (const book of books) {
      Books2.push(book)
      data = tampil_book(
        book.title,
        book.image,
        book.author,
        book.year,
        book.id,
        book.isComplete
      )
      window.temp_html += data
    }
    document.querySelector('#tampilsection2 .row').innerHTML = temp_html
  } else if (localStorage.getItem('Books2') == null) {
    localStorage.setItem('Books2', '')
  }
  buttonSubmit = document.querySelector('#submit')
  buttonSubmit.addEventListener('click', ev => {
    submitForm()
    alert('Submitted')
    ev.preventDefault()
  })
})

// submit lalu simpan di list
function submitForm () {
  jdlbuku = document.getElementById('jdl_buku').value
  penulis = document.getElementById('penulis').value
  tahunTerbit = document.getElementById('tahunTerbit').value
  // img
  img = document.getElementById('image-file')
  img_url = ''
  console.log(img)
  reader = new FileReader()
  reader.onload = () => {
    dataBuku = {
      id: `book${+new Date()}`,
      title: jdlbuku,
      author: penulis,
      year: parseInt(tahunTerbit),
      isComplete: false,
      image: reader.result
    }
    Books1.push(dataBuku)
    save_book()
  }
  reader.readAsDataURL(img.files[0])
  window.location.reload()
}

// penyimpanan buku
function save_book () {
  return localStorage.setItem('Books1', JSON.stringify(Books1))
}

function save_book2 () {
  return localStorage.setItem('Books2', JSON.stringify(Books2))
}

function session_save_book () {
  return sessionStorage.setItem('Books1', JSON.stringify(sessionBooks1))
}
function session_save_book2 () {
  return sessionStorage.setItem('Books2', JSON.stringify(sessionBooks2))
}

// tampilkan buku
function tampil_book (jdlbuku, image, penulis, tahunTerbit, id, isCompleted) {
  let temp_html = `
  <div class="col-md-3 px-0 ">
    <div class="card" style="width: 100%; height: 650px" id='${id}'>
      <img src="${image}" style=' height:413px; object-fit: cover; object-position:center;' class="card-img-top" id="gbrbuku"
        aria-label="gambar buku" alt="Gambar buku.png">
      <div class="card-body">
        <h5 class="card-title" id="jdlbuku" aria-label="jdlbuku">${jdlbuku}</h5>
        <p class="card-text" id="sinopsis" aria-label="sinopsis">${penulis}</p>
        <p class="card-text" id="sinopsis" aria-label="sinopsis">${tahunTerbit}</p>
        <div class="row text-center">
        ${
          isCompleted === false
            ? `<div class="col">
        <a href="#" class="btn btn-primary" onclick="sudah_dibaca('${id}')">Already</a>
      </div>`
            : `<div class="col">
        <a href="#" class="btn btn-primary" onclick="belum_dibaca('${id}')">Not Already</a>
      </div>`
        }
      <div class="col">
          <a href="#" class="btn btn-danger" onclick="hapus_buku('${id}')">Hapus</a>
      </div> 
      </div>
    </div>
    </div>
  </div>
  `
  return temp_html
}

// hapus tambah data
function hapus_data () {
  document.getElementById('jdl_buku').value = ''
  document.getElementById('penulis').value = ''
  document.getElementById('tahunTerbit').value = ''
}

// sudah dibaca
function sudah_dibaca (id_book) {
  // penambahan ke book 2
  data = JSON.parse(localStorage.getItem('Books1')).find(
    Books1 => Books1.id == id_book
  )
  console.log(data)

  data.isCompleted = true
  Books2.push(data)
  console.log(Books2)
  save_book2()

  // data books1 list baru
  for (let index = 0; index < Books1.length; index++) {
    if (Books1[index].id === id_book) {
      Books1.splice(index, 1)
    }
  }
  save_book()

  window.location.reload()
}

function belum_dibaca (id_book) {
  // penambahan ke book 2
  data = JSON.parse(localStorage.getItem('Books2')).find(
    Books2 => Books2.id == id_book
  )
  console.log(data)

  data.isCompleted = false
  Books1.push(data)
  console.log(Books2)
  save_book()

  // data books2 list baru
  for (let index = 0; index < Books2.length; index++) {
    if (Books2[index].id === id_book) {
      Books2.splice(index, 1)
    }
  }
  save_book2()

  window.location.reload()
}

function hapus_buku (id_book) {
  // cek di buku 1
  for (let index = 0; index < Books1.length; index++) {
    const element = Books1[index]
    if (element.id == id_book) {
      Books1.splice(index, 1)
      save_book()
      window.location.reload()
    }
  }
  // cek di buku 2
  for (let index = 0; index < Books2.length; index++) {
    const element = Books2[index]
    if (element.id == id_book) {
      Books2.splice(index, 1)
      save_book2()
      window.location.reload()
    }
  }
}

function search_book (ev) {
  sessionStorage.clear()
  sessionBooks1.splice(0, sessionBooks1.length)
  sessionBooks2.splice(0, sessionBooks2.length)
  search_buku_receive = document
    .querySelector('#search-book')
    .value.trim()
    .toLowerCase()

  temp_html = ''

  if (ev.key !== 'Enter') {
    return
  }

  if (search_buku_receive === '') {
    return window.location.reload()
  }

  // cari data dari buku1 dan buku2
  for (let i = 0; i < Books1.length; i++) {
    if (Books1[i].title.toLowerCase().includes(search_buku_receive)) {
      sessionBooks1.push(Books1[i])
    }
  }
  session_save_book()

  for (let i = 0; i < Books2.length; i++) {
    if (Books2[i].title.toLowerCase().includes(search_buku_receive)) {
      sessionBooks2.push(Books2[i])
    }
  }
  session_save_book2()

  if (sessionBooks1.length === 0 && sessionBooks2.length === 0) {
    let temp_html = `
    <div class="col px-0 my-4 text-center">
      <h1> Data Tidak Ditemukan </h1>
    </div>
    `
    document.querySelector('#tampilsection1 .row').innerHTML = temp_html
    document.querySelector('#tampilsection2 .row').innerHTML = temp_html
    return
  }

  if (sessionBooks2.length === 0 || sessionBooks1.length === 0) {
    let temp_html = `
    <div class="col px-0 my-4 text-center">
    <h1> Data Tidak Ditemukan </h1>
    </div>
    `
    if (sessionBooks2.length === 0) {
      document.querySelector('#tampilsection2 .row').innerHTML = temp_html
    } else if (sessionBooks1.length === 0) {
      document.querySelector('#tampilsection1 .row').innerHTML = temp_html
    }
  }
  // TODO: penampilan buku sesuai nama dan tampil buku dalam session
  tampil_session_book()
}

// tampil session book
function tampil_session_book () {
  temp_html = ''
  buku1 = JSON.parse(sessionStorage.getItem('Books1'))
  console.log(buku1)
  buku2 = JSON.parse(sessionStorage.getItem('Books2'))
  if (buku1.length > 0) {
    for (const book of buku1) {
      data = tampil_book(
        book.title,
        book.image,
        book.author,
        book.year,
        book.id,
        book.isComplete
      )
      window.temp_html += data
    }
    document.querySelector('#tampilsection1 .row').innerHTML = temp_html
  }

  temp_html = ''
  if (buku2.length > 0) {
    for (const book of buku2) {
      data = tampil_book(
        book.title,
        book.image,
        book.author,
        book.year,
        book.id,
        book.isComplete
      )
      window.temp_html += data
    }
    document.querySelector('#tampilsection2 .row').innerHTML = temp_html
  }
  return
}
