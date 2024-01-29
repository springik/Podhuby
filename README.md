# Podhuby
#### Website made in the MEVN stack [^1]

## Installation
1. Clone the repo or download the .zip file and extract it.
2. Run the DB creation query in the `/DB/CreationQuery.sql` directory. [^2]
3. Run the following commands:
   ```bash
   npm run dev
   ```
   on the `/Frontend/Podhuby` directory.

   ```bash
   npm run devStart
   ```
   on the `/Backend` directory
8. Check out the website on **`localhost:8081`** [^3]

---

### Cloning the repository
```bash
 git clone https://github.com/springik/Podhuby.git
```

### Dependencies

- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [MariaDB](https://mariadb.org/)
- [Vue.js](https://vuejs.org/)

---
[^1]: MariaDB, Express.js, Vue.js, Node.js.
[^2]: The recomended database system is MariaDB. There's no guarantee for other database systems.
[^3]: The API runs on `localhost:8080`
