
function makeFoldersArray() {
  return [
    {
        "id": 1,
        "name": "acidic"
    },
    {
        "id": 2,
        "name": "likeable"
    },
    {
        "id": 3,
        "name": "holistic"
    }
  ]
}

function makeNotesArray() {
  return [
    {
        "id": 1,
        "name": "membership",
        "content": "Im baby knausgaard cloud bread hot chicken 8-bit jianbing +1 pitchfork snackwave.  Art party pour-over trust fund DIY retro.",
        "folder_id": 1,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 2,
        "name": "alcohol",
        "content": "Gluten-free etsy waistcoat yuccie occupy, biodiesel edison bulb prism selvage raclette tumblr next level asymmetrical tilde. Hell of lumbersexual schlitz man bun vaporware tbh paleo marfa stumptown cliche skateboard helvetica thundercats.",
        "folder_id": 1,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 3,
        "name": "attitude",
        "content": "Godard bespoke keytar heirloom kitsch microdosing. Taiyaki kitsch master cleanse woke offal DIY activated charcoal yuccie lomo.",
        "folder_id": 1,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 4,
        "name": "assistance",
        "content": "Palo santo selvage snackwave, twee single-origin coffee dreamcatcher tbh mixtape gochujang pok pok cray shaman. Selvage wayfarers forage biodiesel raclette jean shorts hell of single-origin coffee cloud bread marfa chartreuse.",
        "folder_id": 1,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 5,
        "name": "injury",
        "content": "Schlitz affogato adaptogen cloud bread iceland put a bird on it. Direct trade polaroid beard, pop-up vinyl semiotics cardigan. Sriracha helvetica freegan, taiyaki cold-pressed williamsburg cornhole kogi pabst.",
        "folder_id": 1,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 6,
        "name": "poetry",
        "content": "Ugh hammock locavore, cornhole cardigan la croix synth before they sold out. Edison bulb taxidermy health goth cardigan, banh mi bicycle rights chartreuse pour-over everyday carry four loko pitchfork before they sold out.",
        "folder_id": 2,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 7,
        "name": "vehicle",
        "content": "Cray scenester tacos church-key, hexagon paleo keytar put a bird on it art party disrupt shoreditch typewriter lumbersexual hella vice.",
        "folder_id": 2,
        "date_modified": "2021-02-21T22:19:58.495Z"
    },
    {
        "id": 8,
        "name": "camera",
        "content": "Taiyaki kitsch master cleanse woke offal DIY activated charcoal yuccie lomo. Palo santo selvage snackwave, twee single-origin coffee dreamcatcher tbh mixtape gochujang pok pok cray shaman.",
        "folder_id": 2,
        "date_modified": "2021-02-21T22:19:58.495Z"
    }
  ]
}

function makeExpectedFolder(folder) {
  return {
    id: folder.id,
    name: folder.name
  }
}

function makeExpectedNote(note) {
  return {
    id: note.id,
    name: note.name,
    content: note.content,
    folder_id: note.folder_id,
    date_modified: note.date_modified
  }
}

function makeExpectedFolderNotes(folder_id, notes) {
  const expectedNotes = notes
    .filter(note => note.folder_id === folder_id)
 
  return expectedNotes.map(note => {
    return makeExpectedNote(note)
  })
}

function makeMaliciousFolder() {
  const maliciousFolder = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedFolder = makeExpectedFolder((maliciousFolder), notes)
  
  return {
    maliciousFolder,
    expectedFolder,
  }
}

function createTestData() {
  const testFolders = makeFoldersArray()
  const testNotes = makeNotesArray()
  return { testFolders, testNotes }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        folders,
        notes
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE folders_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE notes_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('folders_id_seq', 0)`),
        trx.raw(`SELECT setval('notes_id_seq', 0)`),
      ])
    )
  )
}

function seedTables(db, folders, notes=[]) { 
  return db.transaction(async trx => {
    await trx.into('folders').insert(folders)
    await trx.raw(
      `SELECT setval('folders_id_seq', ?)`,
      [folders[folders.length - 1].id],
    )
    if (notes.length) {
      await trx.into('notes').insert(notes)
      await trx.raw(
        `SELECT setval('notes_id_seq', ?)`,
        [notes[notes.length - 1].id],
      )
    }
  })
}

function seedMaliciousFolder(db, folder) {
  return db.transaction(async trx => {
    await trx.into('folders').insert(folder)
    await trx.raw(
      `SELECT setval('folders_id_seq', ?)`,
      [1],
    )
  })
}

module.exports = {
  makeExpectedFolder,
  makeExpectedNote,
  makeExpectedFolderNotes,
  makeMaliciousFolder,

  createTestData,
  cleanTables,
  seedTables,
  seedMaliciousFolder
}
