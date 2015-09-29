describe("Bacteriology Controller", function () {
    var $scope, rootScope, contextChangeHandler, spinner, conceptSetService;

    beforeEach(module('bahmni.clinical'));

    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        $scope.consultation = {mdrtbSpecimen: [], saveHandler: new Bahmni.Clinical.SaveHandler(), postSaveHandler: new Bahmni.Clinical.SaveHandler()};
        rootScope = $rootScope;
        contextChangeHandler = {
            execute: function () {
                return {allow: true}
            }, reset: function () {
            }
        };

        var spinner = jasmine.createSpyObj('spinner', ['forPromise']);
        conceptSetService = jasmine.createSpyObj('conceptSetService', ['getConceptSetMembers']);
        contextChangeHandler = jasmine.createSpyObj('contextChangeHandler', ['add']);

        spinner.forPromise.and.callFake(function (param) {
            return {
                then: function () {
                    return {};
                }
            }
        });


        conceptSetService.getConceptSetMembers.and.returnValue({});

        $controller('BacteriologyController', {
            $scope: $scope,
            $rootScope: rootScope,
            contextChangeHandler: contextChangeHandler,
            spinner: spinner,
            conceptSetService: conceptSetService
        });
    }));

    describe("Add Sample", function () {
        it("should add sample", function () {
            var newSpecimen = {
                dateCollected: "2015-10-01T18:30:00.000Z",
                type: "Blood",
                identifier: "1234",
                sample: {
                    additionalAttributes: {}
                }
            };
            $scope.newSpecimen = newSpecimen;
            $scope.addSpecimen();
            expect($scope.newSpecimens[0]).toBe(newSpecimen);
            expect($scope.newSpecimen).toEqual({sample: {additionalAttributes: []}});
        });
    });

    describe("Edit Sample", function () {
        var newSpecimen1 = {
            dateCollected: "2015-10-01T18:30:00.000Z",
            type: "Urine",
            identifier: "1235",
            sample: {
                additionalAttributes: []
            }
        };
        var newSpecimen2 = {
            dateCollected: "2015-10-01T18:30:00.000Z",
            type: "Blood",
            identifier: "1236",
            sample: {
                additionalAttributes: []
            }
        };
        var newSpecimen3 = {
            dateCollected: "2015-10-01T18:30:00.000Z",
            type: "Sputum",
            identifier: "1234",
            sample: {
                additionalAttributes: []
            }
        };

        it("should not edit sample if form is filled", function () {
            $scope.newSpecimens = [newSpecimen1, newSpecimen2];
            $scope.newSpecimen = newSpecimen3;
            $scope.editSpecimen(newSpecimen1);
            expect($scope.newSpecimens.length).toBe(2);
            expect($scope.newSpecimen).toBe(newSpecimen3);
        });

        it("should edit sample if form is empty", function () {
            $scope.newSpecimens = [newSpecimen1, newSpecimen2];
            $scope.editSpecimen(newSpecimen1);
            expect($scope.newSpecimens.length).toBe(1);
            expect($scope.newSpecimen).toBe(newSpecimen1);
        });
    });

    describe("Remove Sample", function () {
        var newSpecimen1 = {
            dateCollected: "2015-10-01T18:30:00.000Z",
            type: "Urine",
            identifier: "1235",
            sample: {
                additionalAttributes: []
            }
        };
        var newSpecimen2 = {
            dateCollected: "2015-10-01T18:30:00.000Z",
            type: "Blood",
            identifier: "1236",
            sample: {
                additionalAttributes: []
            }
        };
        it("should remove sample", function () {
            $scope.newSpecimens = [newSpecimen1, newSpecimen2];
            $scope.removeSpecimen(newSpecimen1);
            expect($scope.newSpecimens.length).toBe(1);
            expect($scope.newSpecimens[0]).toBe(newSpecimen2);
        });
    });
});