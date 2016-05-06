use blood;

insert into hospitals 
(username, password, name, address, email, phonenum, hospitalurl, createdat, updatedat)
values
('drake', 'password', 'drake hospital', '123 fake street', 'drake@hospital.com', '1111111111', 'www.drake.com', now(), now())
;

insert into schedules
(day, openhours, closehours, createdat, updatedat, hospitalid)
values
(1, 8, 17, now(), now(), 1),
(2, 8, 17, now(), now(), 1),
(3, 8, 17, now(), now(), 1),
(4, 8, 17, now(), now(), 1),
(5, 8, 14, now(), now(), 1),
(6, 11, 12, now(), now(), 1),
(7, null, null, now(), now(), 1)
;