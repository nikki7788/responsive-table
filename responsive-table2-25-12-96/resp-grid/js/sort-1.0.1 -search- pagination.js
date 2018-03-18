//<reference path="../scripts/jquery-3.3.1.js" />

$(document).ready(function () {

    //   ###############################**********------global varables-------**********************#######################  
    var searchHtml;
    var tr;

    //لیست دانشجویان را درخود ذخیره میکند به ضورت ارایه ای از ابجکت ها
    var stdTable = [];

    //شماره استیودنت ای دی
    var num = 0;

    //شمارش تعداد چک باکس های انتخاب شده
    var j = 0;


    //ایدی دانشجویان را برای رخداد های حذف و ویرایش در خود ذخیره میکند
    //var mydata = [];

    //تعدادسطرهای جدول در یک صفحه رادرخود ذخیره میکند
    var lmt;

    //جدول و مقادیر ذخیره شده درلوکال استوریج رابرمیگرداند وقتی مرورگردلود میشود
    loadData();

    //###############################**********------events-------**********************#######################
    //search icon 
    $(".btnSearch").click(function () {
        $("#mySearch").toggle("left");
    });
    //remove placeholder text when focus on the search input
    $("#mySearch").focus(function () {
        $(this).removeAttr("placeholder");
    });
    //add a placeholder when focus out
    $("#mySearch").focusout(function () {
        $(this).attr("placeholder", "جست و جو ...");
    });

    //event for دانشجوی جدید
    $(".bt button").click(function () {
        clearTextBox();
       
    });

    //var rtlChar = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
    //$(document).ready(function () {
    //    $('#mySearch').keyup(function () {
    //        var isRTL = this.value.match(rtlChar);
    //        if (isRTL !== null) {
    //            this.style.direction = 'rtl';
    //        }
    //        else {
    //            this.style.direction = 'ltr';
    //        }
    //    });
    //});

    //search
    $("#mySearch").on("keyup", function () {
        debugger;
        //پیام خطای موردی یافت نشد را پاک میکند
        $("#myTable+div.error").remove();

        getLocalStorage();


        //   var tr = $("#myTable tbody tr");
        if ($(this).val().toLowerCase().trim()) {
            var wordSearch = $(this).val().toLowerCase().trim();
        }

        if (wordSearch) {
            searchHtml = [];
            for (var i = 0; i < stdTable.length; i++) {

                if (stdTable[i].studentName.toLowerCase().indexOf(wordSearch) > -1) {
                    searchHtml.push(stdTable[i]);
                }
            }
            if (searchHtml == "") {
                searchHtml = "error";

            }
        } else {

            searchHtml = undefined;
        }

        loadData();
        rePage();
        //$("#myTable tbody tr").filter(function () {
        //    $(this).toggle($(this).text().toLowerCase().indexOf(wordSearch) > -1);
        //});
    });

    //clicking on انتخاب همه  
    $(".selectAll").click(function () {
        debugger;
        //  var j = 0;
        //تمام چک باکس هارامیریزد داخل متغیر
        var allCheckedBox = $(".singleCheck");

        //تمام چک باکس های انتخاب شده رامیریزد داخل متغیر
        // var checkedBox = $(".singleCheck:checked");

        //بررسی میکند که چک باکس انتخاب همه, تیک نخورده باشد
        if (j != allCheckedBox.length) {

            for (var i = 0; i < allCheckedBox.length; i++) {
                // چک باکس هایی که تیک نخورده اند راتیک میزند
                if (!allCheckedBox.eq(i).is(":checked")) {
                    allCheckedBox.eq(i).attr("checked", "checked");
                    j++;
                }
            }
            $("#selectAll").attr("checked", "checked");
            // j = allCheckedBox.length;
        } else {

            for (var i = 0; i < allCheckedBox.length; i++) {
                // تیک چک باکس هایی که تیک خورده اند را برمیدارد
                if (allCheckedBox.eq(i).prop("checked")) {
                    allCheckedBox.eq(i).removeAttr("checked");
                    if (j > 0) {
                        j--;
                    }
                }
            }
            $("#selectAll").removeAttr("checked");

        }
    });


    $("#groupdelete").click(function () {
        debugger;
        var allCheckedBox = $(".singleCheck");
        if (allCheckedBox.is(":checked")) {
            groupDelete(allCheckedBox);
        }
    })


    //رخداد کلیک برای دکمه اضافهکن در مودال
    $("#btnAdd").click(function () {
        add();
    });

    //رخداد کلیک برای دکمه ویرایش در مودال
    $("#btnEdit").click(function () {
        update();
    });

    //the event for click on sorted item
    $("th a i").click(function () {
        debugger;
        if ($(this).is($("th a i").eq(0))) {
            mySort("IDdesc");
        }
        if ($(this).is($("th a i").eq(1))) {
            mySort("IDasc");
        }
        if ($(this).is($("th a i").eq(2))) {
            mySort("stdNameDesc");
        }
        if ($(this).is($("th a i").eq(3))) {
            mySort("stdNameAsc");
        }
    });


    $("#btnApply").click(function () {
        // lmt = $("#pglmt").val();
        //$("#myTable").hpaging("newLimit", lmt);
        rePage();
    });
    function rePage() {
        lmt = $("#pglmt").val();
        $("#myTable").hpaging("newLimit", lmt);
    }
    $("#myTable").hpaging({ "limit": $("#pglmt").val() });
    //$(function () {
    //    $("#myTable").hpaging({ "limit": lmt });
    //});
    //   #########################--------***********-----functions -----***********--------############################
    function loadData() {
        debugger;

        $("#selectAll").removeAttr("checked");

        //درهربار لوداحرای لودیدتاتیک های چک باکس ها پاک میسشود
        j = 0;
        var myHtml = "";// جدول را پاک میکند.
        //استیودنت ای دی را درپاک میکند


        if (searchHtml) {
            if (searchHtml == "error") {
                //$("<span><p>موردی یافت نشد!</p></span>)").insertBefor("#myTable tbody");
                $("#myTable").after($("<div class='error text-center bg-warning' style='width=100%'><p class='text-danger' style='font-size:24px'><em>موردی یافت نشد!</em></p></div>)"));

            } else {
                $(searchHtml).each(function (key, item) {
                    myHtml += "<tr>";
                    myHtml += "<td class='select'><input type='checkbox' class='singleCheck' disabled/></td>";
                    myHtml += "<td class='sID'>" + item.studentID + "</td>";
                    myHtml += "<td>" + item.studentName + "</td>";
                    myHtml += "<td>" + item.startYear + "</td>";
                    myHtml += "<td>" + item.fieldID + "</td>";
                    myHtml += "<td>" + item.fieldName + "</td>";
                    myHtml += '<td ><div class="mr-1 row"><a href="#" class="myedit btn btn-success m-1" >ویرایش<i style="font-size:16px;color:rgb(182, 255, 0)" class="fa  fa-spin">&#xf044;</i></a><a href="#" class="myDelete btn btn-danger m-1" > حذف <i class="fa fa-trash fa-spinner fa-spin" style="color:rgb(255, 216, 0);font-size:16px"></i></a></div></td>';
                    myHtml += "</tr>";
                    //      mydata.push(item.studentID);
                });
            }
            $("table tbody").html(myHtml);
        } else {
            // mydata = [];
            getLocalStorage();
            //جدول را میسازد
            $(stdTable).each(function (key, item) {
                myHtml += "<tr>";
                myHtml += "<td class='select'><input type='checkbox' class='singleCheck' disabled/></td>";
                myHtml += "<td class='sID'>" + item.studentID + "</td>";
                myHtml += "<td>" + item.studentName + "</td>";
                myHtml += "<td>" + item.startYear + "</td>";
                myHtml += "<td>" + item.fieldID + "</td>";
                myHtml += "<td>" + item.fieldName + "</td>";
                myHtml += '<td ><div class="mr-1 row"><a href="#" class="myedit btn btn-success m-1" >ویرایش<i style="font-size:16px;color:rgb(182, 255, 0)" class="fa  fa-spin">&#xf044;</i></a><a href="#" class="myDelete btn btn-danger m-1" > حذف <i class="fa fa-trash fa-spinner fa-spin" style="color:rgb(255, 216, 0);font-size:16px"></i></a></div></td>';
                myHtml += "</tr>";
                //   mydata.push(item.studentID);
            });
            $("table tbody").html(myHtml);
            tr = $("#myTable tbody tr");
        }

        //ریسپانسیو کردن جدول-دستور پلاگین
        $('table').tableMobilize();

        // اگر اینجا تعریف نکنیم وقتی روی ویرایش کلیک کردیم ومودال بازشد و دکمه ویرایش اطلاعات رازدیم دیگروقتی روی ویرایش در جدول کلیک  میکنیم اتفاقی نمی افتد
        $(".myedit").click(function () {
            debugger;
            var myClick = $(this);
            Edit(myClick);
        });

        //برای دلیت هم وقتی ویرایش یکبار انجام شود کلا هیچ رخدادی روی تی بادی های جدول کار نمیکند.
        $(".myDelete").click(function () {
            var clickDelte = $(this);
            myDelete(clickDelte);
        });

        $(".select").click(function () {
            debugger;
            var currentSelect = $(this).children();

            if (!currentSelect.prop("checked")) {
                currentSelect.attr("checked", "checked");
                j++;
            } else {
                currentSelect.removeAttr("checked", "checked");
                if (j > 0) {
                    j--;
                }
            }
            for (var i = 0; i < $(".singleCheck").length; i++) {
                if (j == $(".singleCheck")) {
                    $("#selectAll").attr("checked", "checked");
                } else {
                    $("#selectAll").removeAttr("checked", "checked");
                }
            }

            if (j == $(".singleCheck").length) {
                $("#selectAll").attr("checked", "checked");
            } else {
                $("#selectAll").removeAttr("checked", "checked");
            }

        });

    };//end load

    //متد دکمه اضافه کن
    function add() {
        debugger;

        var resVal = validate();
        if (resVal == false) {
            return false;
        }
        else {
            var mystd = new myStudent($("#studentName").val(), $("#startYear").val(),
                $("#fieldID").val());
            mystd.studentID = ++num;
            stdTable.push(mystd);
            saveLocalStorage();
            searchHtml = undefined;
            clearSearchBox();
            loadData();
            rePage();
            $("#myModal").modal("hide");
            clearTextBox();

        }
    };

    //رخداد کلیک برای دکمه ویرایش در جدول
    function Edit(cl) {
        var i = 0;
        var cID = cl.parents("tr").children("td.sID").html();

        while (i < $(".myedit").length) {
            if (cl.is($(".myedit").eq(i))) {

                getLocalStorage();

                for (var i = 0; i < stdTable.length; i++) {
                    if (stdTable[i].studentID == cID) {
                        $("#studentID").val(stdTable[i].studentID);
                        $("#studentName").val(stdTable[i].studentName);
                        $("#startYear").val(stdTable[i].startYear);
                        $("#fieldID").val(stdTable[i].fieldID);
                        $("#myModal").modal("show");
                        $("#btnAdd").hide();
                        $("#btnEdit").show();
                        break;
                    }
                }
                break;
            }
            i++;
        }
    };

    //متد دکمه حذف گروهی در بالای جدول
    function groupDelete(allCheckedBox) {
        debugger;
        getLocalStorage();
        //for (var i = 0; i < allCheckedBox.length; i++) {
        //if (allCheckedBox.eq(i).is(":checked")) {
        swal({
            title: 'آیا میخواهید این گزینه حذف شود؟',
            text: "!در صورت حذف ٫اطلاعات مورد نطر قابل بازیابی نمی باشند",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '!بله حذف کن',
            animation: false,
            customClass: 'animated zoomInRight'

        }).then((result) => {
            if (result.value) {
                debugger;
                for (var i = 0; i < allCheckedBox.length; i++) {
                    if (allCheckedBox.eq(i).is(":checked")) {
                        for (var j = 0; j < stdTable.length; j++) {
                            if (stdTable[j].studentID == clickID(allCheckedBox.eq(i))) {
                                stdTable.splice((j), 1);
                                break;
                            }

                        }
                    }

                }
                if (searchHtml) {
                    k = 0;
                    for (var i = 0; i < allCheckedBox.length; i++) {
                        if (allCheckedBox.eq(i).is(":checked")) {
                            for (var j = 0; j < searchHtml.length; j++) {

                                if (searchHtml[j].studentID == clickID(allCheckedBox.eq(i))) {
                                    searchHtml.splice((j), 1);
                                    break;
                                }

                            }
                        }

                    }
                }
            }
            saveLocalStorage();
            loadData();
            rePage();
            swal(
                '!حذف شد',
                '!حذف با موفقیت انجام شد.',
                'success'
            )

        }) //end swal
    };
    //رخداد کلیک برای دکمه حذف در جدول
    function myDelete(cld) {
        for (var i = 0; i < $(".myDelete").length; i++) {

            if (cld.is($(".myDelete").eq(i))) {
                getLocalStorage();
                //------------swal-----------------------
                swal({
                    title: 'آیا میخواهید این گزینه حذف شود؟',
                    text: "!در صورت حذف ٫اطلاعات مورد نطر قابل بازیابی نمی باشن",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: '!بله حذف کن',
                    animation: false,
                    customClass: 'animated zoomInRight'

                }).then((result) => {
                    if (result.value) {
                        var cID = cld.parents("tr").children("td.sID").html();
                        //  var cID = $("#myTable tbody tr .myDelete").parents("td").prevAll("td.sID").html();
                        debugger;
                        for (var i = 0; i < stdTable.length; i++) {
                            if (stdTable[i].studentID == cID) {
                                stdTable.splice(i, 1);

                            } if (searchHtml) {
                                if (searchHtml[i]) {
                                    if (searchHtml[i].studentID == cID) {
                                        searchHtml.splice(i, 1);
                                    }
                                }
                            }
                        }
                        saveLocalStorage();
                        loadData();
                        rePage();
                        swal(
                            '!حذف شد',
                            '!حذف با موفقیت انجام شد.',
                            'success'
                        )
                    }
                }) //end swal
                break;
            }
        }
    }

    //check the validation of inputs
    function validate() {
        // $("#studentID").val().trim();
        debugger;
        var isvalid = true;
        var sn = $("#studentName");
        var sy = $("#startYear");
        var fID = $("#fieldID");

        var s_reg = (/\d/);

        if (sn.val().trim().match(s_reg) || sn.val().trim() == "") {
            sn.css("border-color", "red");
            isvalid = false;
            //$("#btnAdd").attr("disabled", "disabled")
        }
        else {
            sn.css("border-color", "lightgrey");
        }
        if (sy.val().trim().match(/\D/) || sy.val().trim() == "") {
            sy.css("border-color", "red");
            isvalid = false;
        }
        else {
            sy.css("border-color", "lightgrey");
        }
        if (fID.val().match(/\D/) || fID.val().trim() == "") {
            fID.css("border-color", "red");
            isvalid = false;
        }
        else {
            fID.css("border-color", "lightgrey");
        }
        return isvalid;
    };

    //تابع دکمه ویرایش در مودال
    function update() {
        debugger;

        var resVal = validate();
        if (resVal == false) {
            return false;
        }
        else {
            debugger;
            var currentID = $("#studentID").val();
            for (var i = 0; i < stdTable.length; i++) {
                if (stdTable[i].studentID == currentID) {
                    stdTable[i].studentName = $("#studentName").val();
                    stdTable[i].startYear = $("#startYear").val();
                    stdTable[i].fieldID = $("#fieldID").val();
                }
                if (searchHtml) {
                    if (searchHtml[i]) {

                        if (searchHtml[i].studentID == currentID) {
                            searchHtml[i].studentName = $("#studentName").val();
                            searchHtml[i].startYear = $("#startYear").val();
                            searchHtml[i].fieldID = $("#fieldID").val();
                        }
                    }
                }
            }
            saveLocalStorage();
            loadData();
            $("#myModal").modal("hide");
            clearTextBox();
            rePage();
        }
    };

    //تابع مرتب کردن اطلاعات
    function mySort(varaible) {
        debugger;
        if (searchHtml) {
            var myLoacalVar = searchHtml;
        } else {
            var myLoacalVar = stdTable;
        }
        switch (varaible) {
            case "IDasc":
                myLoacalVar.sort(myCompare("studentID"));
                saveLocalStorage();
                loadData();
                rePage();
                break;
            case "IDdesc":
                myLoacalVar.sort(myCompare("studentID", "desc"));
                saveLocalStorage();
                loadData();
                rePage();
                break;
            case "stdNameAsc":
                myLoacalVar.sort(myCompare("studentName"));
                saveLocalStorage();
                loadData();
                rePage();
                break;
            case "stdNameDesc":
                myLoacalVar.sort(myCompare("studentName", "desc"));
                saveLocalStorage();
                loadData();
                rePage();
                break;
            default:
        }

    };
    function myCompare(key, order) {
        debugger;
        if (order === "undefined") {
            order = "asc"
        }
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }
            const aa = (a[key] === "string") ? a[key].toLoweCase() : a[key];
            const bb = (b[key] === "string") ? a[key].toLoweCase() : b[key];
            let comparison = 0;
            if (aa > bb) {
                comparison = 1;
            }

            else if (aa < bb) {
                comparison = -1;
            }
            else {
                comparison = 0;
            }
            return (
                (order == "desc") ? (comparison * -1) : comparison
            );
        };
    };

    //save object array on local storage
    function saveLocalStorage() {

        //Storage !=== "undefinded" and Storage !=== "undefinded" are the same as typeof (localStorage) != "undefinded"
        if ((localStorage) != "undefined") {
            localStorage.setItem("studentList", JSON.stringify(stdTable));

            //  مقدار پیش فرض خود که صفرداده ایم رانگیرد  num باعث میشود وقتی صفحه رو دوباره لود میکنیم
            localStorage.setItem("num_st", num);
            getLocalStorage();
        }
    };

    //read from local storage
    function getLocalStorage() {

        if (typeof (localStorage) != "undefined") {
            //برای این است که اگر برای اولین بار صفحه لود میشود هیچ اطلاعاتی داخل لوکال نیست و نال را میریزد داخل 
            //  میریزد و بعد درقسمت   پوش کردن خطای نال میدهد  stdTable متغیر ارایه ما یعنی
            if (localStorage.studentList) {
                var x = JSON.parse(localStorage.getItem("studentList"));
                stdTable = x;
                num = Number(localStorage.getItem("num_st"));
            }
        }
    };

    //clear the information in the modal box
    function clearTextBox() {
        $("#studentID").val(num + 1);
        $("#studentName").val("");
        $("#startYear").val("");
        $("#fieldID").val("");
        $("#btnAdd").show();
        $("#btnEdit").hide();
        $("#studentName,#startYear,#fieldID").css("border-color", "lightgrey");
    };
    //پاک کردن متن سرج باکس
    function clearSearchBox() {
        $("#mySearch").val("");
    }
    //prototype 
    function myStudent(stdName, sYear, fID) {
        this.studentID;
        this.studentName = stdName;
        this.startYear = sYear;
        this.fieldID = fID;
        this.fieldName;
    };




});//end $(document).ready
