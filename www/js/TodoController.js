/**
 * Created by vinhhoang on 02/10/2015.
 */
(function () {
    angular
        .module('todo')
        .controller('todoController',
        ['$scope', '$log', 'Project',
            '$ionicModal', '$state',
            '$ionicLoading', '$ionicPopup', todoController]);

    function todoController($scope, $log, Project, $ionicModal, $state, $ionicLoading, $ionicPopup) {
        //Local variable
        var ctrl = this;

        //Global variable
        ctrl.projects = [];
        ctrl.currentProject = {};
        ctrl.modal = {};
        ctrl.newTask = {};
        ctrl.newProject = {};
        ctrl.showReorder = false;

        //Initial
        init();
        function init() {
            //Load project from database
            Project.loadAll().then(function (rs) {
                ctrl.projects = rs;
                $log.log(ctrl.projects);
                ctrl.currentProject = rs[0];
            });

            //Get ionic-modal instance
            $ionicModal.fromTemplateUrl('modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                ctrl.modal = modal;
            });
        }


        //Project operation methods
        ctrl.selectProject = function (project) {
            ctrl.currentProject = project;
        };
        ctrl.createNewProject = function () {
            ctrl.newProject = {};
            $state.go('newProject');
            ctrl.modal.show();
        };
        ctrl.cancelNewProject = function () {
            ctrl.newProject = {};
            ctrl.modal.hide();
        };
        ctrl.saveNewProject = function () {
            //Show loading
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple"></ion-spinner>'
            });
            Project.create(ctrl.projects, ctrl.newProject).then(function (rs) {
                ctrl.projects = rs;
                $log.log(ctrl.projects);
                //When complete close loading
                $ionicLoading.hide();
            }, function (error) {
                $log.log(error);
                $ionicLoading.hide();
            });
            ctrl.modal.hide();
        };
        ctrl.deleteProject = function (project) {
            Project.delete(ctrl.projects, project).then(function (rs) {
                ctrl.projects = rs;
            }, function (er) {
                $log.log(er);
            })
        };


        //Task operation methods
        ctrl.createNewTask = function () {
            ctrl.newTask = {};
            $state.go('newTask');
            ctrl.modal.show();
        };
        ctrl.cancelNewTask = function () {
            ctrl.newTask = {};
            ctrl.modal.hide();
        };
        ctrl.saveNewTask = function () {
            ctrl.currentProject.tasks = ctrl.currentProject.tasks || [];
            ctrl.currentProject.tasks.push(ctrl.newTask);
            Project.update(ctrl.projects, ctrl.currentProject).then(function (rs) {

            }, function (error) {
                $log.log(error);
            });

            ctrl.modal.hide();
        };
        ctrl.deleteTask = function (task) {
            var index = ctrl.currentProject.tasks.indexOf(task);
            ctrl.currentProject.tasks.splice(index, 1);
            Project.update(ctrl.projects, ctrl.currentProject).then(function () {

            })
        };


        //Modal operation methods
        ctrl.openModal = openModal;
        ctrl.closeModal = closeModal;


        //Ionic list operation methods
        ctrl.toggleReorder = function () {
            ctrl.showReorder = !ctrl.showReorder;
        };
        ctrl.moveProject = function (item, from, to) {
            ctrl.projects.splice(from, 1);
            ctrl.projects.splice(to, 0, item);
        };


        //Set up event handlers
        $scope.$on('$destroy', function () {
            ctrl.modal.remove();
        });


        /*
         * Implement functions
         * */

        //Implement operation modal methods
        function openModal() {
            ctrl.modal.show();
        }

        function closeModal() {
            ctrl.modal.hide();
        }
    }
})();