Practice-Project

books get
http://localhost:5000/
http://localhost:5000/isbn/1
http://localhost:5000/author/Chinua Achebe
http://localhost:5000/title/Fairy tales

register post
http://localhost:5000/register
{
	"username": "user1",
	"password": "pw1",
}

login post
http://localhost:5000/customer/login
{
	"username": "user1",
	"password": "pw1",
}

put, delete
http://localhost:5000/customer/auth/review/1
{
	"username": "user1",
	"password": "pw1",
	"review": "good book"
}
