import toastr from "toastr";

toastr.options = {
  closeButton: true,
  debug: true,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-full-width",
  preventDuplicates: false,
  onclick: null,
  showDuration: "100000",
  hideDuration: "1000",
  timeOut: "50000",
  extendedTimeOut: "10000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

export default toastr;
