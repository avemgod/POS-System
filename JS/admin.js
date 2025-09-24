// reference database
var itemsRef = firebase.database().ref("Items");

// ===== View Stock =====

// item baru ditambahkan
itemsRef.on("child_added", snap => {
    var itemCode = snap.child("itemCode").val();
    var itemName = snap.child("itemName").val();
    var itemPrice = snap.child("itemPrice").val();
    var quantity = snap.child("quantity").val();

    $('#viewStockTbl').append(
        "<tr id='row-" + itemCode + "'><td>" + itemCode + "</td><td>" +
        itemName + "</td><td>" + itemPrice + "</td><td>" + quantity + "</td></tr>"
    );

    // juga load ke dropdown
    $('#itemCode').append("<option>" + itemCode + "</option>");
    $('#remitemCode').append("<option>" + itemCode + "</option>");
});

// item diubah (misalnya quantity update)
itemsRef.on("child_changed", snap => {
    var itemCode = snap.child("itemCode").val();
    var itemName = snap.child("itemName").val();
    var itemPrice = snap.child("itemPrice").val();
    var quantity = snap.child("quantity").val();

    $("#row-" + itemCode).html(
        "<td>" + itemCode + "</td><td>" + itemName + "</td><td>" +
        itemPrice + "</td><td>" + quantity + "</td>"
    );
});

// item dihapus
itemsRef.on("child_removed", snap => {
    var itemCode = snap.child("itemCode").val();
    $("#row-" + itemCode).remove();
    $("#itemCode option:contains(" + itemCode + ")").remove();
    $("#remitemCode option:contains(" + itemCode + ")").remove();
});

// ===== Add to stock =====
function loadDataToAdd(){
    var x = document.getElementById('itemCode').value;
    if(x == 'selectID'){
        document.getElementById('addToForm').reset();
    } else {
        itemsRef.orderByChild("itemCode").equalTo(x).once("child_added", function(data) {
            document.getElementById('itemName').value = data.val().itemName;
        });
    }   
}

var addItemForm = document.querySelector("#addToForm");
addItemForm.addEventListener('submit', function(event){
    event.preventDefault();
    if(addItemForm.checkValidity() === false){
        event.stopPropagation();
        addItemForm.classList.add('was-validated');
    } else {
        var iCode = document.getElementById('itemCode').value;
        var iName = document.getElementById('itemName').value;
        var iQty = document.getElementById('itemQty').value;
        addItem(iCode, iName, iQty);
        document.getElementById('addToForm').reset();
    }
});

function addItem(iCode, iName, iQty){
    itemsRef.orderByChild('itemCode').equalTo(iCode).once('child_added', function(data){
        var qty = parseInt(data.val().quantity) + parseInt(iQty);
        firebase.database().ref("Items/" + data.key).update({ quantity: qty });
    });   
}

// ===== Add new item =====
var newItemForm = document.querySelector("#addNewForm");
newItemForm.addEventListener('submit',function(event){
    event.preventDefault();
    if(newItemForm.checkValidity() === false){
        event.stopPropagation();
        newItemForm.classList.add('was-validated');
    } else {
        var iCode = document.getElementById('newItemCode').value;
        var iName = document.getElementById('newItemName').value;
        var iQty = document.getElementById('newItemQty').value;
        var iPrice = document.getElementById('newItemPrice').value;
        saveNewItem(iCode, iName, iQty, iPrice);
        document.getElementById('addNewForm').reset();
    }
});

function saveNewItem(iCode,iName,iQty,iPrice){
    var newItemRef = itemsRef.push();
    newItemRef.set({
        itemCode: iCode,
        itemName: iName,
        itemPrice: iPrice,
        quantity: iQty
    });            
} 

// ===== Remove item =====
function loadDataToRemove(){
    var x = document.getElementById('remitemCode').value;
    if(x == 'selectID'){
        document.getElementById('remItemForm').reset();
    } else {
        itemsRef.orderByChild("itemCode").equalTo(x).once("child_added", function(data) {
            document.getElementById('remitemName').value = data.val().itemName;
        });
    }   
}

var remForm = document.querySelector("#remItemForm");
remForm.addEventListener('submit',function(event){
    event.preventDefault();
    if(remForm.checkValidity() === false){
        event.stopPropagation();
        remForm.classList.add('was-validated');
    } else {
        var iCode = document.getElementById('remitemCode').value;
        removeItem(iCode);
        document.getElementById('remItemForm').reset();
    }
});

function removeItem(iCode){
    itemsRef.orderByChild('itemCode').equalTo(iCode).once('child_added', function(data){
        firebase.database().ref("Items/" + data.key).remove();
    });   
}

// ===== Promotions =====
var promoForm = document.querySelector("#promoFrm");
promoForm.addEventListener('submit',function(event){
    event.preventDefault();
    if(promoForm.checkValidity() === false){
        event.stopPropagation();
        promoForm.classList.add('was-validated');
    } else {
        var sub = document.getElementById('subject').value;
        var msg = document.getElementById('message').value;
        sendMail(sub, msg);
        document.getElementById('promoFrm').reset();
    }
});

function sendMail(sub,msg){
    var ref = firebase.database().ref("Customer");
    ref.once("value",function(snapshot){
       snapshot.forEach(function(childSnapshot){
           var childData = childSnapshot.val();
           var cusEmail = childData.email;
           Email.send({
            Host : "smtp.elasticemail.com",
            Username : "gimanthad@gmail.com",
            Password : "60cdaef9-cd40-4eae-a8f0-a1e387624824",
            To : cusEmail,
            From : "gimanthad@gmail.com",
            Subject : sub,
            Body : msg
        });
       }); 
    });
}
