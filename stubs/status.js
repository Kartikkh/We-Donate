
var authentication=
{
	response_code : 401,
	reason     :	{
		'message': 'Go home punk',
		'status': false
	}
};

var field_missing=
{
	response_code : 400,
	reason    :     {
		'message' : 'Invalid Request, Required Params Missing',
		'status'  : false,
	}
};

var wrong_field=
{
	response_code : 406,
	reason    :     {
		'message' : 'Invalid Request, Value Not Acceptable ',
		'status'  : false,
	}
};

var server_failiure_error_Parked=
{
	response_code : 503,
	reason    :     {
		message : 'There\'s an error processing request.Error has been logged with id',
		id	  :  '',
		status  : false,
	}
};
var server_failiure_mail_Sent=
{
	response_code : 500,
	reason    :     {
		'message' : 'There\'s an error processing request.Error has been shared with respective people',
		'status'  : false,
	}
};
var server_failiure_not_Logged_properly=
{
	response_code : 508,
	reason    :     {
		'message' : 'There\'s an error processing request.Error Looped around and couldnt be logged properly, please contact at help@tripshire.com for more details',
		'status'  : false,
	}
};
var data_not_found=
{
	response_code : 404,
	reason    :     {
		'message' : 'Required Content not Found',
		'status'  : false,
	}
};
var success=
{
	response_code : 200,
	reason    :     {
		'status'  : true,
	}
};
var archived=
{	response_code : 410,
	reason	: 		{
		'status'	: false,
		'message'	: 	'Resource has been archived'
	}
};
var notAllowed=
{	response_code : 403,
	reason	: 		{
		'status' 	: 	false,
		'message'	: 	'Not allowed to access this resource'
	}
};


module.exports=
{
	authentication_failure	: authentication,
	field_missing           : field_missing,
	wrong_field				: wrong_field,
	Parked 					: server_failiure_error_Parked,
	Mailed					: server_failiure_mail_Sent,
	notLogged               : server_failiure_not_Logged_properly,
	noData					: data_not_found,
	success					: success,
	archived				: archived,
	notAllowed				: notAllowed
}
