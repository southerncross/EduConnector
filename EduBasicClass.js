var EduConnector = {
  
    createNew: function() {
	var c = {};
	c.user = User.createNew();
	c.state = State.createNew();
	
	return c;
    }
};

var EduUser = {
    
    createNew: function() {
	var u = {};
	return u;
    }
};

var EduState = {
    
    createNew: function() {
	var s = {};
	return s;
    }
};
