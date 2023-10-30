import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';//permite recibir peticiones.
import helmet from 'helmet';//correccion a las protecciones

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';
import MainRouter from './../client/MainRouter';

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from './../client/theme';

import path from 'path';

import devBundle from './devBundle';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import departmentRoutes from './routes/department.routes';
import cityRoutes from './routes/city.routes';
import clientRoutes from './routes/client.routes';
import employeeRoutes from './routes/employee.routes';
import providerRoutes from './routes/provider.routes';
import billRoutes from './routes/bill.routes';
import invoice_detailsRoutes from './routes/invoice_detail.routes';
import productRoutes from './routes/product.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';

import Template from './../template';
import { Category } from '@material-ui/icons';


const CURRENT_WORKING_DIR = process.cwd();// retorna la ruota donde esta ubicado el proyecto
const app = express();//complile a express
devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', departmentRoutes);
app.use('/', cityRoutes);
app.use('/', clientRoutes);
app.use('/', employeeRoutes);
app.use('/', providerRoutes);
app.use('/', invoice_detailsRoutes);
app.use('/', billRoutes);
app.use('/', productRoutes);
app.use('/', postRoutes);
app.use('/', commentRoutes);


app.get('*', (req, res) => { //retornar todas las peticiones que vengan..
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <ThemeProvider theme={theme}>
        <MainRouter />
      </ThemeProvider>
    </StaticRouter>
  );

  if (context.url) {
    return res.redirect(303, context.url);
  }

  const css = sheets.toString();
  res.status(200).send(Template({
    markup,
    css
  }))
});

app.use((err, req, res, next) => {// valida la autentificación del ususario..
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": `${err.name}: ${err.message}`})
  } else if (err) {
    res.status(400).json({ "error": `${err.name}: ${err.message}`});
    console.log(err);
  }
});

export default app;
