 import request from 'supertest';
 import {app} from '../../app';

it('returns a 400 with invalid email',async()=>{
    return request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
 })

 it('returns a 400 with invalid password',async()=>{
     await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);
    await request(app)
    .post('/api/users/signin')
    .send({
         email: 'test@test.com',
        password: 'password123'
    })
    .expect(400);
 })

 it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});



 