
[Learning]


- Configure node pathing by importing path services to main file

`import 'tsconfig-paths/register';`

- Objects will be undefined if not using json body parser in app.use ...

```
import bodyParser from 'body-parser';
app.use(bodyParser.json());
```
