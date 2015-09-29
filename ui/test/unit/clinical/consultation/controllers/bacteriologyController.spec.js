ddescribe("Bacteriology Controller", function () {
    var $scope, rootScope, contextChangeHandler, spinner, conceptSetService;

    beforeEach(module('bahmni.clinical'));

    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        rootScope = $rootScope;
        contextChangeHandler = {
            execute: function () {
                return {allow: true}
            }, reset: function () {
            }
        };

        var spinner = jasmine.createSpyObj('spinner', ['forPromise']);
        conceptSetService = jasmine.createSpyObj('conceptSetService', ['getConceptSetMembers']);

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
            var newSample = {dateCollected: "2015-10-01T18:30:00.000Z", type: "Blood", identifier: "1234"};
            $scope.newSample = newSample;
            $scope.addSample();
            expect($scope.newSamples[0]).toBe(newSample);
            expect($scope.newSample).toEqual({additionalAttributes: []});
        });
    });

    describe("Edit Sample", function () {
        var newSample1 = {dateCollected: "2015-10-01T18:30:00.000Z", type: "Blood", identifier: "1234"};
        var newSample2 = {dateCollected: "2015-11-01T18:30:00.000Z", type: "Blood", identifier: "1234"};
        var newSample = {dateCollected: "2015-12-01T18:30:00.000Z", type: "Blood", identifier: "1234"};

        it("should not edit sample if form is filled", function () {
            $scope.newSamples = [newSample1, newSample2];
            $scope.newSample = newSample;
            $scope.editSample(newSample1);
            expect($scope.newSamples.length).toBe(2);
            expect($scope.newSample).toBe(newSample);
        });

        it("should edit sample if form is empty", function () {
            $scope.newSamples = [newSample1, newSample2];
            $scope.editSample(newSample1);
            expect($scope.newSamples.length).toBe(1);
            expect($scope.newSample).toBe(newSample1);
        });
    })
});