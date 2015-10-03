/**
 * Created by vinhhoang on 02/10/2015.
 */
(function () {
    angular
        .module('todo')
        .factory('Project', ['$q', 'localStorageService', 'filterFilter', '$log',
            function ($q, localStorageService, filterFilter, $log) {
                if (!localStorageService.isSupported) {
                    return false;
                }

                function Project() {
                    this.table = 'Project';
                    this.count = 0;
                }

                Project.loadAll = function () {
                    var deferred = $q.defer();
                    var results = localStorageService.get(this.table);
                    if (results && results.length > 0) {
                        this.count = results.length;
                        deferred.resolve(results);
                    } else {
                        var projects = [
                            {
                                _id: generateID(),
                                name: 'Boxiu',
                                createdDate: new Date(),
                                tasks: [
                                    {
                                        name: 'task1',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task2',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task3',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task4',
                                        createdDate: new Date()
                                    }
                                ]
                            },
                            {
                                _id: generateID(),
                                name: 'Save Location',
                                createdDate: new Date(),
                                tasks: [
                                    {
                                        name: 'task1',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task2',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task3',
                                        createdDate: new Date()
                                    },
                                    {
                                        name: 'task4',
                                        createdDate: new Date()
                                    }
                                ]
                            }
                        ];
                        localStorageService.set(this.table, projects);
                        deferred.resolve(projects);
                    }
                    return deferred.promise;
                };

                Project.create = function (projects, project) {
                    var deferred = $q.defer();
                    project._id = generateID();
                    project.createdDate = new Date();
                    projects.push(project);
                    if (saveToDataBase(projects)) {
                        deferred.resolve(projects);
                    } else {
                        deferred.reject('Create new project error');
                    }
                    return deferred.promise;
                };

                Project.update = function (projects, project) {
                    var deferred = $q.defer();
                    var results = filterFilter(projects, {_id: project._id});
                    $log.log('Update project:');
                    $log.log(results);
                    if (results && results.length > 0) {
                        projects[projects.indexOf(results[0])] = project;
                        if (saveToDataBase(projects)) {
                            deferred.resolve(projects[projects.indexOf(results[0])]);
                        } else {
                            deferred.reject('Save to database error');
                        }
                    } else {
                        deferred.reject('Can not find specific project');
                    }
                    return deferred.promise;
                };

                Project.delete = function (projects, project) {
                    var deferred = $q.defer();
                    var results = filterFilter(projects, {_id: project._id});
                    $log.log('Delete project:');
                    $log.log(results);
                    if (results && results.length > 0) {
                        var index = projects.indexOf(results[0]);
                        projects.splice(index, 1);
                        if (saveToDataBase(projects)) {
                            deferred.resolve(projects);
                        } else {
                            deferred.reject('Save to database error');
                        }
                    } else {
                        deferred.reject('Can not find specific project');
                    }
                    return deferred.promise;
                };

                function generateID() {
                    return Math
                        .floor((1 + Math.random()) * new Date())
                        .toString(16);
                }

                function saveToDataBase(projects) {
                    return localStorageService.set(Project.table, projects);
                }

                return Project;
            }]);
})();