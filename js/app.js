var urlBase = "http://132.145.111.36:8082/api";

var cabinLastId = 0;
var clientLastId = 0;
var messageLastId = 0;


//add validators
const cabinForm = document.querySelectorAll('#cabinCreation');
Array.from(cabinForm).forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
})


/* Funciones de consulta de entidades */
function consultarCabin() {
    $.ajax({
        url: urlBase + "/Cabin/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaCabins").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.id));
                row.append($("<td>").text(item.brand));
                row.append($("<td>").text(item.rooms));
                row.append($("<td>").text(item.category.name));
                row.append($("<td>").text(item.name));
                row.append($("<td>").text(item.description));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onClick="openPopupCabinUpdate(' + item.id + ')">Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowCabin(' + item.id + ')>Delete</button>'));
                $("#cuerpoTablaCabins").append(row);
            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
}

function consultarClients() {
    $.ajax({
        url: urlBase + "/Client/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaClients").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.idClient));
                row.append($("<td>").text(item.name));
                row.append($("<td>").text(item.email));
                row.append($("<td>").text(item.age));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onClick=openPopupClientUpdate(' + item.idClient + ')>Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowClient(' + item.idClient + ')>Delete</button>'));
                $("#cuerpoTablaClients").append(row);

            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
}

function consultarMessages() {
    $.ajax({
        url: urlBase + "/Message/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaMessages").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.idMessage));
                row.append($("<td>").text(item.client.name));
                row.append($("<td>").text(item.cabin.name));
                row.append($("<td>").text(item.messageText));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onClick=openPopupMessageUpdate(' + item.idMessage + ')>Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowMessage(' + item.idMessage + ')>Delete</button>'));
                $("#cuerpoTablaMessages").append(row);
            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar");
        }
    });
}

function consultarCategories() {
    $.ajax({
        url: urlBase + "/Category/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaCategories").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.id));
                row.append($("<td>").text(item.name));
                row.append($("<td>").text(item.description));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onClick=openPopupCategoryUpdate(' + item.id + ')>Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowCategory(' + item.id + ')>Delete</button>'));
                $("#cuerpoTablaCategories").append(row);
            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar");
        }
    });
}

function consultarReservacion() {
    $.ajax({
        url: urlBase + "/Reservation/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaReservations").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.idReservation));
                row.append($("<td>").text(item.client.name));
                row.append($("<td>").text(item.cabin.name));
                row.append($("<td>").text(parseDateField(item.startDate)));
                row.append($("<td>").text(parseDateField(item.devolutionDate)));
                row.append($("<td>").text(item.status));

                if(item.score == null){
                    row.append($("<td>").text("No calificado"));
                } else{
                    row.append($("<td>").text(item.score.stars));
                }

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-success btn-block w-100" onclick="openPopupScoreCreate(' + item.idReservation + ')\">Calificar</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onclick="openPopupReservationUpdate(' + item.idReservation + ')">Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowReservation(' + item.idReservation + ')>Delete</button>'));
                $("#cuerpoTablaReservations").append(row);
                
                
            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar");
        }
    });
}


function consultarConteoReservas() {
    var start = $("#conteoReservasDatepicker_start").val();
    var end = $("#conteoReservasDatepicker_end").val();
    var count = 0;
    $.ajax({
        url: urlBase + "/Reservation/report-dates/" + start +"/"+end,
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaConteoReservasReservations").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.idReservation));
                row.append($("<td>").text(item.client.name));
                row.append($("<td>").text(item.cabin.name));
                row.append($("<td>").text(parseDateField(item.startDate)));
                row.append($("<td>").text(parseDateField(item.devolutionDate)));
                row.append($("<td>").text(item.status));

                if(item.score == null){
                    row.append($("<td>").text("No calificado"));
                } else{
                    row.append($("<td>").text(item.score.stars));
                }
                count += 1;
                
                $("#cuerpoTablaConteoReservasReservations").append(row);
                
                
            });
            alert("Entre el periodo: " + start + " y " + end +" se encontraron un total de " + count + " reservas realizadas.");
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar");
        }
    });
}
function consultarAdmins() {
    $.ajax({
        url: urlBase + "/Admin/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaAdmins").empty();
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td>").text(item.idAdmin));
                row.append($("<td>").text(item.name));
                row.append($("<td>").text(item.email));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" onClick=openPopupAdminUpdate(' + item.idAdmin + ')>Edit</button>'));
                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onClick=deleteRowAdmin(' + item.idAdmin + ')>Delete</button>'));
                $("#cuerpoTablaAdmins").append(row);

            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
}

/*Funciones para la creacion de entidades */

function crearCabin() {
    var cabin = {
        brand: $("#createBrandCabin").val(),
        rooms: parseInt($("#createRoomsCabin").val()),
        category: { id: parseInt($("#createCategoryIdCabin").val()) },
        name: $("#createNameCabin").val(),
        description: $("#createDescriptionCabin").val(),
    };
    console.log(cabin);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Cabin/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(cabin),
            statusCode: {
                201: function () {
                    consultarCabin();
                    alert("cabina creada");
                },
            }, error: function (error) {
                console.log(error);
                alert("Error al crear")
            }
        });
    }
    let popup = document.getElementById("popupCabinCreate");
    popup.classList.remove("open-popup");
};

function crearClient() {
    var client = {
        name: $("#createNameClient").val(),
        email: $("#createEmailClient").val(),
        age: $("#createAgeClient").val(),
        password: $("#createPasswordClient").val()
    };
    console.log(client);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Client/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(client),
            statusCode: {
                201: function () {
                    consultarClients();
                    alert("Cliente creado");
                },
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error al crear")
                }
            }
        });
    }
    let popup = document.getElementById("popupClientCreate");
    popup.classList.remove("open-popup");
};

function crearMessage() {
    var message = {
        cabin: { id: parseInt($("#createCabinMessage").val()) },
        client: { idClient: parseInt($("#createClientMessage").val()) },
        messageText: $("#createMessageText").val()
    };
    console.log(message);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Message/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(message),
            statusCode: {
                201: function () {
                    consultarMessages();
                    alert("Mensaje creado");
                },
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error al crear")
                }
            }
        });
    }
    consultarMessages();
    let popup = document.getElementById("popupMessageCreate");
    popup.classList.remove("open-popup");
}
function crearCategory() {
    var category = {
        name: $("#createCategoryText").val(),
        description: $("#createCategoryDescription").val()
    }
    console.log(category);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Category/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(category),
            statusCode: {
                201: function () {
                    consultarCategories();
                    alert("Categoría creada");
                },
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error al crear")
                }
            }
        });
    }
    let popup = document.getElementById("popupCategoryCreate");
    popup.classList.remove("open-popup");
};

function crearReservation() {
    var reservation = {
        startDate: $("#createStartDateReservation").val(),
        devolutionDate: $("#createDevolutionDateReservation").val(),
        client: { idClient: parseInt($("#createClientReservation").val()) },
        cabin: { id: parseInt($("#createCabinReservation").val()) },
        status: "created"
    };
    console.log(reservation);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Reservation/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(reservation),
            statusCode: {
                201: function () {
                    alert("Reservación creada");
                },
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error al crear")
                }
            }
        });
    }
    let popup = document.getElementById("popupReservationCreate");
    popup.classList.remove("open-popup");
};


function crearScore() {
    var exist = $("#createExistScore").val();

    console.log(exist);
    
    if(exist.length > 0){

        var score = {
            idScore: exist,
            reservation: { "idReservation": $("#createIdReservaScore").val() },
            stars: $("#createScoreScore").val(),
            messageText: $("#createTextScore").val()
        }


        if (confirm("Esta seguro de calificar?") == true) {
            $.ajax({
                url: urlBase + "/Score/update",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(score),
                statusCode: {
                    201: function () {
                        alert("Calificación Actualizada");
                    },
                }, error: function (error) {
                    if (error.status != 201) {
                        alert("Error al actualizar calificación")
                    }
                }
            });
        }
    }else{
        console.log(exist);
        if (confirm("Esta seguro?") == true) {
            var score = {
                reservation: { "idReservation": $("#createIdReservaScore").val() },
                stars: $("#createScoreScore").val(),
                messageText: $("#createTextScore").val()
            }
            $.ajax({
                url: urlBase + "/Score/save",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(score),
                statusCode: {
                    201: function () {
                        alert("Reservacion calificada creada");
                    },
                }, error: function (error) {
                    if (error.status != 201) {
                        alert("Error al Calificar")
                    }
                }
            });
        }
    }
    
    
    
   
    let popup = document.getElementById("popupReservationCreate");
    popup.classList.remove("open-popup");
};

function crearAdmin() {
    var admin = {
        name: $("#createNameAdmin").val(),
        email: $("#createEmailAdmin").val(),
        password: $("#createPasswordAdmin").val()
    };
    console.log(admin);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Admin/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(admin),
            statusCode: {
                201: function () {
                    consultarAdmins();
                    alert("Admin creado");
                },
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error al crear")
                }
            }
        });
    }
    let popup = document.getElementById("popupAdminCreate");
    popup.classList.remove("open-popup");
};

/*Funciones para borrar registros */

function deleteRowCabin(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Cabin/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarCabin();
                    alert("Cabin was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting cabin")
                }
            }
        });
    }
};


function deleteRowClient(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Client/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarClients();
                    alert("Client was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting Client")
                }
            }
        });
    }
};

function deleteRowMessage(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Message/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarMessages();
                    alert("Message was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting message")
                }
            }
        });
    }
};

function deleteRowCategory(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Category/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarCategories();
                    alert("Category was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting Category")
                }
            }
        });
    }
};

function deleteRowReservation(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Reservation/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarReservacion();
                    alert("Reservation was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting Reservation")
                }
            }
        });
    }
};

function deleteRowAdmin(theId) {
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Admin/" + theId,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {
                    consultarAdmins();
                    alert("Admin was deleted");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error deleting Admin")
                }
            }
        });
    }
};

function openPopupCabinCreate() {

    $.ajax({
        url: urlBase + "/Category/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#createCategoryIdCabin").empty();
            response.forEach(item => {
                var optionItem = $("<option>");
                optionItem.attr('value', item.id);
                optionItem.text(item.name);
                $("#createCategoryIdCabin").append(optionItem);
            });
        }, error: function (error) {
            alert("Error al consultar Categorías");
        }
    });

    let popup = document.getElementById("popupCabinCreate");
    popup.classList.add("open-popup");

}


function openPopupClientCreate() {
    let popup = document.getElementById("popupClientCreate");
    popup.classList.add("open-popup");
}

function openPopupMessageCreate() {

    $.ajax({
        url: urlBase + "/Client/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#createClientMessage").empty();
            response.forEach(item => {
                var optionItem = $("<option>");
                optionItem.attr('value', item.idClient);
                optionItem.text(item.name);
                $("#createClientMessage").append(optionItem);
            });
        }, error: function (error) {
            alert("Error al consultar Clientes");
        }
    });

    $.ajax({
        url: urlBase + "/Cabin/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#createCabinMessage").empty();
            response.forEach(item => {
                var optionItem = $("<option>");
                optionItem.attr('value', item.id);
                optionItem.text(item.name);
                $("#createCabinMessage").append(optionItem);
            });
        }, error: function (error) {
            alert("Error al consultar Cabañas");
        }
    });

    let popup = document.getElementById("popupMessageCreate");
    popup.classList.add("open-popup");
}

function openPopupCategoryCreate() {
    let popup = document.getElementById("popupCategoryCreate");
    popup.classList.add("open-popup");
}
function openPopupCategoryUpdate(param) {
    $.ajax({
        url: urlBase + "/Category/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response); +
                $("#updateCategoryId").val(response.id);
            $("#updateCategoryText").val(response.name);
            $("#updateCategoryDescription").val(response.description);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupCategoryEdit");
    popup.classList.add("open-popup");
}
function updateCategory() {
    var category = {
        id: $("#updateCategoryId").val(),
        name: $("#updateCategoryText").val(),
        description: $("#updateCategoryDescription").val()
    };
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Category/update",
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(category),
            statusCode: {
                201: function () {
                    consultarCategories();
                    alert("Category was updated");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error updating category")
                }
                console.log(error);
            }
        });
    }
    let popup = document.getElementById("popupCategoryEdit");
    popup.classList.remove("open-popup");
}
function openPopupReservationCreate() {
    $('#createStartDateReservation').datepicker({dateFormat: "yy-mm-dd"});
    $('#createDevolutionDateReservation').datepicker({dateFormat: "yy-mm-dd"});

    $.ajax({
        url: urlBase + "/Client/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#createClientReservation").empty();
            response.forEach(item => {
                var optionItem = $("<option>");
                optionItem.attr('value', item.idClient);
                optionItem.text(item.name);
                $("#createClientReservation").append(optionItem);
            });
        }, error: function (error) {
            alert("Error al consultar Clientes");
        }
    });

    $.ajax({
        url: urlBase + "/Cabin/all",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#createCabinReservation").empty();
            response.forEach(item => {
                var optionItem = $("<option>");
                optionItem.attr('value', item.id);
                optionItem.text(item.name);
                $("#createCabinReservation").append(optionItem);
            });
        }, error: function (error) {
            alert("Error al consultar Cabañas");
        }
    });

    let popup = document.getElementById("popupReservationCreate");
    popup.classList.add("open-popup");
}

function openPopupScoreCreate(idReservation) {
    let popup = document.getElementById("popupScoreCreate");
    $("#createIdReservaScore").val(idReservation);  
    $.ajax({
        url: urlBase + "/Reservation/"+idReservation,
        type: "GET",
        dataType: "json",
        success: function (response) {           
            console.log(response);
            $("#createIdClientScore").val(response.client.name);
            $("#createIdCabinScore").val(response.cabin.name);
            if(response.score != null){
                console.log(response.score);
                $("#createIdReservaScore").val(response.idReservation);
                $("#createScoreScore").val(response.score.stars);
                $("#createTextScore").val(response.score.messageText);
                $("#createExistScore").val(response.score.idScore);
            }

        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });  

    for (let index = 1; index <= 5; index++) {
        var optionItem = $("<option>");
        optionItem.attr('value', index);
        optionItem.text(index);
        $("#createScoreScore").append(optionItem);
    }

    popup.classList.add("open-popup");
}

function openPopupAdminCreate() {
    let popup = document.getElementById("popupAdminCreate");
    popup.classList.add("open-popup");
}
function openPopupAdminUpdate(param) {
    $.ajax({
        url: urlBase + "/Admin/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#updateIdAdmin").val(response.idAdmin);
            $("#updateNameAdmin").val(response.name);
            $("#updateEmailAdmin").val(response.email);
            $("#updatePasswordAdmin").val(response.password);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupAdminUpdate");
    popup.classList.add("open-popup");
}
function updateAdmin() {
    var admin = {
        idAdmin: $("#updateIdAdmin").val(),
        name: $("#updateNameAdmin").val(),
        email: $("#updateEmailAdmin").val(),
        password: $("#updatePasswordAdmin").val()
    };
    console.log(admin);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Admin/update",
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(admin),
            statusCode: {
                201: function () {
                    consultarAdmins();
                    alert("Admin was updated");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error updating Admin")
                }
                console.log(error);
            }
        });
    }
    let popup = document.getElementById("popupAdminUpdate");
    popup.classList.remove("open-popup");
}

function openPopupCabinUpdate(param) {
    $.ajax({
        url: urlBase + "/Cabin/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#editIdCabin").val(response.id);
            $("#editBrandCabin").val(response.brand);
            $("#editRoomsCabin").val(response.rooms);
            $("#editCategoryIdCabin").val(response.category.id);
            $("#editNameCabin").val(response.name);
            $("#editDescriptionCabin").val(response.description);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupCabinEdit");
    popup.classList.add("open-popup");
}
function updateCabin() {
    $.ajax({
        url: urlBase + "/Category/" + $("#editCategoryIdCabin").val(),
        type: "GET",
        dataType: "json",
        success: function (response) {
            var cabin = {
                id: $("#editIdCabin").val(),
                name: $("#editNameCabin").val(),
                rooms: $("#editRoomsCabin").val(),
                description: $("#editDescriptionCabin").val(),
                brand: $("#editBrandCabin").val(),
                category: { id: response.id, name: response.name }
            };
            console.log(cabin);
            if (confirm("Esta seguro?") == true) {
                $.ajax({
                    url: urlBase + "/Cabin/update",
                    method: "PUT",
                    timeout: 3000,
                    contentType: 'application/json',
                    data: JSON.stringify(cabin),
                    statusCode: {
                        201: function () {
                            consultarCabin();
                            alert("Cabin was updated");

                        }
                    }, error: function (error) {
                        if (error.status != 201) {
                            alert("Error updating cabin")
                        }
                    }
                });
            }
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupCabinEdit");
    popup.classList.remove("open-popup");

}
function openPopupClientUpdate(param) {
    $.ajax({
        url: urlBase + "/Client/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#editIdClient").val(response.idClient);
            $("#editNameClient").val(response.name);
            $("#editPasswordClient").val(response.password);
            $("#editEmailClient").val(response.email);
            $("#editAgeClient").val(response.age);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupClientEdit");
    popup.classList.add("open-popup");
}

function openPopupMessageUpdate(param) {
    $.ajax({
        url: urlBase + "/Message/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#editIdMessage").val(response.idMessage);
            $("#editMessageText").val(response.messageText);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupMessageEdit");
    popup.classList.add("open-popup");
}


function openPopupReservationUpdate(param) {
    $('#editStartDateReservation').datepicker({dateFormat: "yy-mm-dd"});
    $('#editDevolutionDateReservation').datepicker({dateFormat: "yy-mm-dd"});
    $.ajax({
        url: urlBase + "/Reservation/" + param,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#editIdReservation").val(response.idReservation);
            $("#editStartDateReservation").val(response.startDate);
            $("#editDevolutionDateReservation").val(response.devolutionDate);
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });
    let popup = document.getElementById("popupReservationEdit");
    popup.classList.add("open-popup");

}
function updateReservation() {
    var reservation = {
        idReservation: $("#editIdReservation").val(),
        startDate: parseDateField($("#editStartDateReservation").val()),
        devolutionDate: parseDateField($("#editDevolutionDateReservation").val()),
        status: $("#editStatusReservation").val()
    };
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Reservation/update",
            method: "PUT",
            timeout: 3000,
            contentType: 'application/json',
            data: JSON.stringify(reservation),
            statusCode: {
                201: function () {
                    consultarReservacion();
                    alert("Reservation was updated");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error updating reservation")
                }
            }
        });
    }
    let popup = document.getElementById("popupReservationEdit");
    popup.classList.remove("open-popup");
}


function updateClient() {
    var client = {
        idClient: $("#editIdClient").val(),
        name: $("#editNameClient").val(),
        password: $("#editPasswordClient").val(),
        email: $("#editEmailClient").val(),
        age: $("#editAgeClient").val(),
    };
    console.log(client);
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Client/update",
            method: "PUT",
            timeout: 3000,
            contentType: 'application/json',
            data: JSON.stringify(client),
            statusCode: {
                201: function () {
                    consultarClients();
                    alert("Client was updated");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error updating Client")
                }
            }
        });
    }
    let popup = document.getElementById("popupClientEdit");
    popup.classList.remove("open-popup");

}

function updateMessage() {
    var message = {
        idMessage: $("#editIdMessage").val(),
        messageText: $("#editMessageText").val(),
    };
    if (confirm("Esta seguro?") == true) {
        $.ajax({
            url: urlBase + "/Message/update",
            method: "PUT",
            timeout: 3000,
            contentType: 'application/json',
            data: JSON.stringify(message),
            statusCode: {
                201: function () {
                    consultarMessages();
                    alert("Message was updated");

                }
            }, error: function (error) {
                if (error.status != 201) {
                    alert("Error updating Message")
                }
            }
        });
    }
    let popup = document.getElementById("popupMessageEdit");
    popup.classList.remove("open-popup");
}

function closePopup(whichPopup) {
    let popup = document.getElementById(whichPopup);
    popup.classList.remove("open-popup");
}

function openReport(){
    $('#conteoReservasDatepicker_start').datepicker({dateFormat: "yy-mm-dd"});
    $('#conteoReservasDatepicker_end').datepicker({dateFormat: "yy-mm-dd"});

    $.ajax({
        url: urlBase + "/Reservation/report-status",
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#reporteReservasCompletadas").text(response.completed);
            $("#reporteReservasCanceladas").text(response.cancelled);
            
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });

    $.ajax({
        url: urlBase + "/Reservation/report-clients",
        type: "GET",
        dataType: "json",
        success: function (response) {
            $("#cuerpoTablaTopClients").empty();
            var posClient = 1;
            response.forEach(item => {
                var row = $("<tr>");
                row.append($("<td id='topNameClient_" + posClient + "'>"));
                row.append($("<td id='topEmailClient_" + posClient + "'>"));
                row.append($("<td>").text(item.total));
                consultaTopClient(item.client, posClient)
                
                $("#cuerpoTablaTopClients").append(row);
                posClient += 1;
            });
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    });

    
}

function consultaTopClient(clientId, position){
    $.ajax({
        url: urlBase + "/Client/"+clientId,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#topNameClient_" + position).text(response.name);
            $("#topEmailClient_" + position).text(response.email);
            
        }, error: function (error) {
            console.log(error);
            alert("Error al consultar")
        }
    })
}

function parseDateField(date){
    var parsedDate = new Date(date);
    var month = parsedDate.getMonth() +1;
    return parsedDate.getUTCFullYear() + "-" + month + "-" + parsedDate.getDate();
}

$(document).ready(function () {
    consultarCabin();
    consultarClients();
    consultarMessages();
    consultarCategories();
    consultarReservacion();
    consultarAdmins();
    
});


